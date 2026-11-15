/* PMT Woodland Intermediate landing page
   Tracking, dates, accordions, video facade, copy-address and motion.
   Settings live in config.js. Add ?debug=1 to the URL to log every tracking event. */
(function () {
  'use strict';

  var C = window.PMT_CONFIG || {};
  var doc = document;
  var root = doc.documentElement;
  var qs = function (s, el) { return (el || doc).querySelector(s); };
  var qsa = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var clamp = function (n, a, b) { return Math.min(b, Math.max(a, n)); };

  var params = new URLSearchParams(location.search);
  var DEBUG = params.get('debug') === '1';
  var mm = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var REDUCED = mm('(prefers-reduced-motion: reduce)');
  var MOTION = C.motion !== false && !REDUCED;
  var HOVER = mm('(hover: hover) and (pointer: fine)');
  var HAS_IO = 'IntersectionObserver' in window;

  root.classList.add('js');
  root.classList.add(MOTION ? 'motion' : 'no-motion');

  /* =====================================================================
     1. TRACKING
     ===================================================================== */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'];
  var utms = (function () {
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('pmt_utms') || '{}') || {}; } catch (e) { saved = {}; }
    UTM_KEYS.forEach(function (k) { var v = params.get(k); if (v) saved[k] = v; });
    try { sessionStorage.setItem('pmt_utms', JSON.stringify(saved)); } catch (e) { /* storage blocked: keep in memory */ }
    return saved;
  })();

  var T = C.tracking || {};

  function loadMeta(id) {
    try {
      /* Meta Pixel base code */
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', id);
    } catch (e) { /* never break the page for tracking */ }
  }

  function loadGa(id) {
    try {
      var s = doc.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      doc.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id, DEBUG ? { debug_mode: true } : {});
    } catch (e) { /* ignore */ }
  }

  /* spec: { meta, custom (bool), ga, params, beacon (bool), done (fn) } */
  function track(spec) {
    var p = {};
    var k;
    for (k in (spec.params || {})) p[k] = spec.params[k];
    for (k in utms) p[k] = utms[k];
    if (DEBUG && window.console) console.log('[PMT event]', { meta: spec.meta || '(none)', ga4: spec.ga || '(none)', params: p });
    try {
      if (spec.meta && window.fbq) window.fbq(spec.custom ? 'trackCustom' : 'track', spec.meta, p);
    } catch (e) { /* ignore */ }
    try {
      if (spec.ga && window.gtag) {
        var g = {};
        for (k in p) g[k] = p[k];
        if (spec.beacon) g.transport_type = 'beacon';
        if (spec.done) g.event_callback = spec.done;
        window.gtag('event', spec.ga, g);
      }
    } catch (e) { /* ignore */ }
  }

  if (T.metaPixelId) loadMeta(T.metaPixelId);
  if (T.ga4Id) loadGa(T.ga4Id);
  /* Page load: PageView + ViewContent (GA4 sends page_view on its own) */
  track({ meta: 'PageView' });
  track({ meta: 'ViewContent', params: { content_name: 'Woodland Intermediate LP', content_category: 'IRC' } });

  function withUtms(url) {
    try {
      var u = new URL(url, location.href);
      UTM_KEYS.forEach(function (k) { if (k !== 'fbclid' && utms[k]) u.searchParams.set(k, utms[k]); });
      return u.toString();
    } catch (e) { return url; }
  }

  /* One click handler for every tracked link */
  doc.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;

    if (a.hasAttribute('data-option')) {
      var opt = a.getAttribute('data-option');
      var spec = {
        meta: 'InitiateCheckout', ga: 'register_click', beacon: true,
        params: {
          option: opt, course: opt === 'licensing' ? '1DPC' : 'IRC', location: 'WLD',
          position: a.getAttribute('data-position'), value: 425, currency: 'USD'
        }
      };
      var plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
      var live = !!(window.fbq || window.gtag);
      if (!plain || !live || e.defaultPrevented) { track(spec); return; } /* nothing to wait for: go right away */
      /* Fire the events, then go to checkout in the same tab. Never wait more than 300ms. */
      e.preventDefault();
      var href = a.href;
      var gone = false;
      var go = function () { if (gone) return; gone = true; location.href = href; };
      spec.done = go;
      track(spec);
      setTimeout(go, 300);
      return;
    }

    var kind = a.getAttribute('data-track');
    if (kind === 'phone') track({ meta: 'Contact', ga: 'phone_tap', params: { position: a.getAttribute('data-position') } });
    else if (kind === 'email') track({ meta: 'Contact', ga: 'email_tap', params: { position: a.getAttribute('data-position') } });
  });

  /* Scroll depth 50% / 90% */
  var depthSent = {};
  function checkDepth(y, vh, total) {
    var pct = total > 0 ? ((y + vh) / total) * 100 : 0;
    [50, 90].forEach(function (mark) {
      if (pct >= mark && !depthSent[mark]) {
        depthSent[mark] = true;
        track({ ga: 'scroll_depth', params: { percent: mark } });
      }
    });
  }

  /* =====================================================================
     2. CONTENT FROM CONFIG (links, phone, rating, dates)
     ===================================================================== */
  function applyConfig() {
    var links = C.links || {};
    qsa('a[data-option]').forEach(function (a) {
      var url = links[a.getAttribute('data-option')];
      if (url) a.href = url;
      if (C.passUtmsToCheckout) a.href = withUtms(a.href);
    });

    if (C.phoneTel) qsa('a[data-phone]').forEach(function (a) { a.href = 'tel:' + C.phoneTel; });
    if (C.phoneDisplay) qsa('[data-phone-text]').forEach(function (el) { el.textContent = C.phoneDisplay; });
    if (C.privacyUrl) qsa('a[data-privacy]').forEach(function (a) { a.href = C.privacyUrl; });

    var rate = qs('[data-rating]');
    if (rate && C.woodlandRating) rate.textContent = C.woodlandRating;
    var count = qs('[data-count]');
    if (count && C.woodlandReviewsShown) count.textContent = String(C.woodlandReviewsShown);

    if (C.showTotalControlLogo === true) {
      var tc = qs('[data-tc-logo]');
      var icon = qs('[data-tc-icon]');
      if (tc) {
        tc.onload = function () { tc.hidden = false; if (icon) icon.style.display = 'none'; };
        tc.src = 'assets/total-control-logo.png';
      }
    }

    var thumb = qs('[data-video-thumb]');
    if (thumb && C.entryTestVideoId && thumb.src.indexOf(C.entryTestVideoId) === -1) {
      thumb.src = 'https://i.ytimg.com/vi/' + C.entryTestVideoId + '/hqdefault.jpg';
    }
  }

  /* Dates: past dates hide automatically, using the date in California. */
  function todayInLA() {
    if (DEBUG && /^\d{4}-\d{2}-\d{2}$/.test(params.get('today') || '')) return params.get('today'); /* test helper */
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return o.year + '-' + o.month + '-' + o.day;
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }
  }

  function dateParts(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
    var f = function (opt) { opt.timeZone = 'UTC'; return new Intl.DateTimeFormat('en-US', opt).format(d); };
    return { wdShort: f({ weekday: 'short' }), wdLong: f({ weekday: 'long' }), mon: f({ month: 'short' }), day: +m[3] };
  }

  var STATUS = { open: 'Open', few: 'Few seats left', full: 'Full' };

  function renderDates() {
    var today = todayInLA();
    var upcoming = (C.dates || []).filter(function (d) { return d && d.date && d.date >= today; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });

    var list = qs('[data-dates]');
    if (list) {
      list.textContent = '';
      if (!upcoming.length) {
        var p = doc.createElement('li');
        p.className = 'dates-none';
        p.appendChild(doc.createTextNode('New Woodland dates are coming soon. Call '));
        var a = doc.createElement('a');
        a.href = 'tel:' + (C.phoneTel || '+19253734802');
        a.setAttribute('data-track', 'phone');
        a.setAttribute('data-position', 'dates');
        a.textContent = C.phoneDisplay || '(925) 373-4802';
        p.appendChild(a);
        p.appendChild(doc.createTextNode(" and we'll tell you the next one."));
        list.appendChild(p);
      } else {
        upcoming.forEach(function (d) {
          var li = doc.createElement('li');
          li.className = 'date-row';
          var label = doc.createElement('span');
          label.className = 'date-label';
          label.textContent = d.label || d.date;
          var st = STATUS[d.status] ? d.status : 'open';
          var pill = doc.createElement('span');
          pill.className = 'status status-' + st;
          pill.textContent = STATUS[st];
          li.appendChild(label);
          li.appendChild(pill);
          list.appendChild(li);
        });
      }
    }

    /* Hero pill + final CTA line: the next date you can still book (skips "full" if a later one is open) */
    var next = upcoming.filter(function (d) { return d.status !== 'full'; })[0] || upcoming[0];
    var dp = next ? dateParts(next.date) : null;
    var pillEl = qs('[data-date-pill]');
    var longWrap = qs('[data-date-long-wrap]');
    if (dp) {
      var s = qs('[data-date-short]');
      if (s) s.textContent = (dp.wdShort + ', ' + dp.mon + ' ' + dp.day).toUpperCase();
      var l = qs('[data-date-long]');
      if (l) l.textContent = dp.wdLong + ', ' + dp.mon + ' ' + dp.day;
    } else {
      if (pillEl) pillEl.hidden = true;
      if (longWrap) longWrap.hidden = true;
    }
  }

  /* =====================================================================
     3. ACCORDIONS (skills + FAQ), VIDEO, COPY ADDRESS
     ===================================================================== */
  function initAccordions() {
    qsa('details.skill, details.faq').forEach(function (d) {
      var sum = qs('summary', d);
      var body = qs('.acc-body', d);
      var anim = null;

      d.addEventListener('toggle', function () {
        if (!d.open) return;
        if (d.classList.contains('skill')) track({ ga: 'skill_open', params: { skill: d.getAttribute('data-skill') } });
        else track({ ga: 'faq_open', params: { question: (qs('.faq-q', d) || sum).textContent.trim() } });
      });

      if (!MOTION || !body || !body.animate) return; /* plain open/close */

      sum.addEventListener('click', function (e) {
        e.preventDefault();
        if (anim) anim.cancel();
        var opts = { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' };
        if (!d.open || d.classList.contains('is-closing')) {
          d.classList.remove('is-closing');
          d.open = true;
          var h = body.scrollHeight;
          anim = body.animate({ height: ['0px', h + 'px'], opacity: [0, 1] }, opts);
          anim.onfinish = anim.oncancel = function () { anim = null; };
        } else {
          var from = body.offsetHeight;
          d.classList.add('is-closing');
          anim = body.animate({ height: [from + 'px', '0px'], opacity: [1, 0] }, opts);
          anim.onfinish = function () { d.open = false; d.classList.remove('is-closing'); anim = null; };
          anim.oncancel = function () { anim = null; };
        }
      });
    });
  }

  function initVideo() {
    var frame = qs('[data-video]');
    if (!frame) return;
    var facade = qs('.video-facade', frame);
    if (!facade) return;
    facade.addEventListener('click', function () {
      if (frame.classList.contains('is-playing')) return;
      track({ meta: 'EntryTestVideoPlay', custom: true, ga: 'video_play', params: { video: 'entry_test' } });
      var id = C.entryTestVideoId || 'RXr6xKW7IaA';
      var f = doc.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
      f.title = '1-Day Premier Course entry test demo';
      f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      f.setAttribute('allowfullscreen', '');
      frame.appendChild(f);
      frame.classList.add('is-playing'); /* the thumbnail crossfades out over the player */
      setTimeout(function () { if (facade.parentNode) facade.parentNode.removeChild(facade); }, 700);
    });
  }

  function initCopy() {
    var btn = qs('[data-copy]');
    if (!btn) return;
    var label = qs('[data-copy-label]', btn);
    var addr = (qs('[data-address]') || {}).textContent || '1400 Pioneer Ave, Woodland, CA 95776';
    var timer;
    function done() {
      btn.classList.add('is-copied');
      label.textContent = 'Copied!';
      clearTimeout(timer);
      timer = setTimeout(function () { btn.classList.remove('is-copied'); label.textContent = 'Copy address'; }, 2000);
    }
    function fallback() {
      try {
        var ta = doc.createElement('textarea');
        ta.value = addr;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
        doc.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, addr.length);
        doc.execCommand('copy');
        doc.body.removeChild(ta);
      } catch (e) { /* ignore */ }
      done();
    }
    btn.addEventListener('click', function () {
      track({ ga: 'copy_address' });
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(done, fallback);
      else fallback();
    });
  }

  /* "Watch the entry test" jump: gold outline pulse on the video card when it arrives */
  function initJump() {
    var link = qs('[data-jump-video]');
    var card = qs('#video-card');
    if (!link || !card) return;
    link.addEventListener('click', function () {
      if (!MOTION) return;
      setTimeout(function () {
        card.classList.remove('is-pulse');
        void card.offsetWidth;
        card.classList.add('is-pulse');
      }, 750);
    });
  }

  /* Sticky mobile CTA bar: built only when config.stickyMobileCta is true */
  function initSticky() {
    if (C.stickyMobileCta !== true || !HAS_IO) return;
    var links = C.links || {};
    var bar = doc.createElement('div');
    bar.className = 'sticky-cta';
    [['licensing', 'NOT LICENSED YET (21+)'], ['licensed', 'ALREADY LICENSED']].forEach(function (o) {
      var a = doc.createElement('a');
      a.className = 'btn';
      a.href = C.passUtmsToCheckout ? withUtms(links[o[0]]) : links[o[0]];
      a.setAttribute('data-option', o[0]);
      a.setAttribute('data-position', 'sticky');
      a.innerHTML = '<span class="btn-label"><span class="btn-k">BOOK NOW</span><span class="btn-o"></span></span>';
      qs('.btn-o', a).textContent = o[1];
      bar.appendChild(a);
    });
    doc.body.appendChild(bar);
    var seen = [];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var i = seen.indexOf(en.target);
        if (en.isIntersecting && i === -1) seen.push(en.target);
        if (!en.isIntersecting && i !== -1) seen.splice(i, 1);
      });
      bar.classList.toggle('is-on', seen.length === 0);
    });
    qsa('.cta-pair').forEach(function (el) { io.observe(el); });
  }

  /* =====================================================================
     4. MOTION
     ===================================================================== */
  function splitWords(el) {
    var lines = qsa('.ln', el);
    if (!lines.length) lines = [el];
    var n = 0;
    lines.forEach(function (line) {
      var words = line.textContent.trim().split(/\s+/);
      line.textContent = '';
      words.forEach(function (w, i) {
        var outer = doc.createElement('span');
        outer.className = 'w';
        var inner = doc.createElement('span');
        inner.style.setProperty('--i', n++);
        inner.textContent = w;
        outer.appendChild(inner);
        line.appendChild(outer);
        if (i < words.length - 1) line.appendChild(doc.createTextNode(' '));
      });
    });
  }

  function buildSplit(host) {
    var pic = qs('picture', host);
    if (!pic) return false;
    var wrap = doc.createElement('div');
    wrap.className = 'split-wrap';
    wrap.setAttribute('aria-hidden', 'true');
    var clips = ['inset(0 66.2% 0 0)', 'inset(0 33% 0 33%)', 'inset(0 0 0 66.2%)'];
    clips.forEach(function (c, i) {
      var s = doc.createElement('div');
      s.className = 'split-slice';
      s.style.setProperty('--i', i);
      s.style.clipPath = c;
      s.style.webkitClipPath = c;
      var clone = pic.cloneNode(true);
      var img = qs('img', clone);
      if (img) { img.alt = ''; img.removeAttribute('loading'); }
      s.appendChild(clone);
      wrap.appendChild(s);
    });
    host.appendChild(wrap);
    return true;
  }

  function countUp(el, to, ms, done) {
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var p = clamp((t - start) / ms, 0, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = String(to); if (done) done(); }
    }
    requestAnimationFrame(step);
  }

  function initReveals() {
    if (!MOTION || !HAS_IO) return;
    var vh = window.innerHeight;

    function play(el, order) {
      if (el.classList.contains('rv-armed')) {
        el.style.setProperty('--d', (order * 75) + 'ms');
        el.classList.add('rv-in');
        el.classList.remove('rv-armed');
        setTimeout(function () { el.classList.remove('rv-in'); el.style.removeProperty('--d'); }, 1500 + order * 75);
      }
      if (el.classList.contains('wipe-armed')) {
        el.classList.add('wipe-in');
        el.classList.remove('wipe-armed');
        setTimeout(function () { el.classList.remove('wipe-in'); }, 1500);
      }
      if (el.classList.contains('split-armed')) {
        if (!qs('.split-wrap', el)) buildSplit(el);
        void el.offsetWidth;
        el.classList.add('split-go');
        setTimeout(function () {
          el.classList.remove('split-armed');
          el.classList.remove('split-go');
          var w = qs('.split-wrap', el);
          if (w) w.parentNode.removeChild(w);
        }, 1500);
      }
      if (el.classList.contains('words-armed')) {
        el.classList.add('words-in');
        el.classList.remove('words-armed');
      }
      if (el.classList.contains('a-armed')) {
        el.classList.add('a-in');
        el.classList.remove('a-armed');
        if (el.getAttribute('data-anim') === 'cred') {
          var count = qs('[data-count]', el);
          var rate = qs('[data-rating]', el);
          var target = parseInt(C.woodlandReviewsShown, 10) || 120;
          /* stars fill first (5 x 120ms), then the count, then the rating */
          setTimeout(function () {
            countUp(count, target, 1400, function () { if (rate) rate.classList.add('is-in'); el.classList.add('cred-done'); });
          }, 650);
        }
      }
    }

    var io = new IntersectionObserver(function (entries) {
      var hits = entries.filter(function (en) { return en.isIntersecting; });
      var order = 0;
      hits.forEach(function (en) {
        io.unobserve(en.target);
        var stagger = en.target.hasAttribute('data-rv') && en.target.parentNode && en.target.parentNode.hasAttribute('data-rv-group');
        play(en.target, stagger ? Math.min(order++, 5) : 0);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.14 });

    var late = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        late.unobserve(en.target);
        play(en.target, 0);
      });
    }, { threshold: 0.45 });

    function below(el, frac) {
      var r = el.getBoundingClientRect();
      return r.top > vh * frac;
    }

    qsa('[data-rv], .h').forEach(function (el) {
      if (!below(el, 0.9)) return;
      el.classList.add('rv-armed');
      io.observe(el);
    });
    qsa('.wipe').forEach(function (el) {
      if (!below(el, 0.9)) return;
      el.classList.add('wipe-armed');
      io.observe(el);
    });
    var prep = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        prep.unobserve(en.target);
        if (!qs('.split-wrap', en.target)) buildSplit(en.target);
      });
    }, { rootMargin: '500px 0px 500px 0px' });
    qsa('[data-split]').forEach(function (el) {
      if (!below(el, 0.9) || !qs('picture', el)) return;
      el.classList.add('split-armed');
      prep.observe(el);
      io.observe(el);
    });
    qsa('[data-words]').forEach(function (el) {
      if (!below(el, 0.9)) return;
      splitWords(el);
      el.classList.add('words-armed');
      io.observe(el);
    });
    qsa('[data-anim]').forEach(function (el) {
      var isCred = el.getAttribute('data-anim') === 'cred';
      if (!below(el, isCred ? 0.5 : 0.9)) return;
      el.classList.add('a-armed');
      if (isCred) { var c = qs('[data-count]', el); if (c) c.textContent = '0'; }
      (isCred ? late : io).observe(el);
    });
  }

  /* Hero: crossfade through 3 range photos once the first has loaded */
  function initHeroSlides() {
    if (!MOTION || C.heroSlideshow !== true) return;
    var media = qs('.hero-media');
    var first = qs('.hero-slide', media);
    var shade = qs('.hero-shade', media);
    if (!media || !first) return;
    var extra = [
      { cls: 'hs-2', name: 'range-vision-headturn', w: 1080, h: 1440, alt: "Rider turning their head to look through a turn at PMT's Woodland range." },
      { cls: 'hs-3', name: 'range-cornering-cfmoto', w: 1080, h: 1920, alt: "Rider on a CFMoto sport bike leaning through a cone-marked corner at PMT's Woodland range." }
    ];
    var slides = [first];
    var idx = 0;
    var timer = null;

    function build(s) {
      var div = doc.createElement('div');
      div.className = 'hero-slide ' + s.cls;
      var sizes = '(min-width: 900px) 54vw, 100vw';
      div.innerHTML = '<picture><source type="image/webp" sizes="' + sizes + '" srcset="' +
        [480, 828, 1080, 1320].map(function (w) { return 'assets/' + s.name + '-' + w + '.webp ' + w + 'w'; }).join(', ') +
        '"><img src="assets/' + s.name + '.jpg" width="' + s.w + '" height="' + s.h + '" decoding="async" alt=""></picture>';
      qs('img', div).alt = s.alt;
      media.insertBefore(div, shade);
      return div;
    }

    function show(n) {
      var prev = slides[idx];
      var next = slides[n];
      if (!next || next === prev) return;
      var img = qs('img', next);
      var go = function () {
        next.classList.remove('is-anim');
        void next.offsetWidth;
        next.classList.add('is-anim');
        next.classList.add('is-on');
        prev.classList.remove('is-on');
        setTimeout(function () { if (!prev.classList.contains('is-on')) prev.classList.remove('is-anim'); }, 1800);
        idx = n;
      };
      if (img.complete && img.naturalWidth) go();
      else { img.addEventListener('load', go, { once: true }); }
    }

    /* each extra photo is only downloaded shortly before its turn */
    function prepare() { if (extra.length) slides.push(build(extra.shift())); }
    function tick() {
      if (doc.hidden) return;
      show((idx + 1) % slides.length);
      setTimeout(prepare, 2500);
    }
    function start() {
      if (timer) return;
      if (slides.length === 1) prepare();
      timer = setInterval(tick, 6000);
    }
    function stop() { clearInterval(timer); timer = null; }

    var firstImg = qs('img', first);
    var ready = function () { setTimeout(start, 1500); };
    var whenLoaded = function () {
      if (doc.readyState === 'complete') ready();
      else window.addEventListener('load', ready, { once: true });
    };
    if (firstImg.complete && firstImg.naturalWidth) whenLoaded();
    else firstImg.addEventListener('load', whenLoaded, { once: true });

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) stop();
      else if (slides.length > 1) start();
    });
  }

  /* Photos: color lifts when centered on screen (phones), fix line slides up on skill tiles */
  function initPhotoStates() {
    if (!MOTION || !HAS_IO || HOVER) return;
    var center = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-centered', en.isIntersecting); });
    }, { rootMargin: '-34% 0px -34% 0px' });
    qsa('.skill-media.duo, .which-photo.duo').forEach(function (el) { center.observe(el); });

    var bandCenter = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-centered', en.isIntersecting && en.intersectionRatio >= 0.5); });
    }, { rootMargin: '-12% -26% -12% -26%', threshold: [0, 0.5, 1] });
    qsa('.band-item').forEach(function (el) { bandCenter.observe(el); });

    var fix = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        fix.unobserve(en.target);
        setTimeout(function () { en.target.classList.add('fix-on'); }, 500);
      });
    }, { threshold: 0.7 });
    qsa('.skill').forEach(function (el) { if (qs('.fix', el)) fix.observe(el); });
  }

  /* 3D tilt toward the cursor (desktop only) */
  function initTilt() {
    if (!MOTION || !HOVER) return;
    qsa('[data-tilt]').forEach(function (el) {
      var glare = doc.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = el.getBoundingClientRect();
          var px = clamp((e.clientX - r.left) / r.width, 0, 1);
          var py = clamp((e.clientY - r.top) / r.height, 0, 1);
          el.classList.add('is-tilting');
          el.style.transition = 'transform .15s ease-out';
          el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 12).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 12).toFixed(2) + 'deg)';
          glare.style.transform = 'translate3d(' + (px * r.width).toFixed(1) + 'px,' + (py * r.height).toFixed(1) + 'px,0)';
        });
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.transition = '';
        el.style.transform = '';
      });
    });
  }

  /* Spotlight on the final CTA photo (desktop only) */
  function initSpotlight() {
    if (!MOTION || !HOVER) return;
    var sec = qs('.final');
    var bg = qs('.final-bg', sec);
    var pic = qs('.final-photo picture', sec);
    if (!sec || !bg || !pic) return;
    var spot = doc.createElement('div');
    spot.className = 'spot';
    spot.setAttribute('aria-hidden', 'true');
    var inner = doc.createElement('div');
    inner.className = 'spot-in';
    var clone = pic.cloneNode(true);
    var img = qs('img', clone);
    if (img) img.alt = '';
    inner.appendChild(clone);
    spot.appendChild(inner);
    bg.appendChild(spot);
    var raf = 0;
    sec.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = bg.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        inner.style.width = r.width + 'px';
        inner.style.height = r.height + 'px';
        spot.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        inner.style.transform = 'translate3d(' + (210 - x).toFixed(1) + 'px,' + (210 - y).toFixed(1) + 'px,0)';
        spot.classList.add('is-on');
      });
    });
    sec.addEventListener('pointerleave', function () { spot.classList.remove('is-on'); });
  }

  /* Reviews: slow marquee on desktop, swipe row with dots on phones */
  function initReviews() {
    var box = qs('[data-reviews]');
    if (!box) return;
    var trackEl = qs('.rev-track', box);
    var cards = qsa('.rev', trackEl);
    if (MOTION && HOVER && window.innerWidth >= 900) {
      cards.forEach(function (c) {
        var clone = c.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('data-anim');
        trackEl.appendChild(clone);
      });
      box.classList.add('rev-marquee');
      return;
    }
    var dotsBox = qs('[data-rev-dots]', box);
    if (!dotsBox) return;
    var dots = cards.map(function () { var s = doc.createElement('span'); dotsBox.appendChild(s); return s; });
    var raf = 0;
    function update() {
      raf = 0;
      var mid = trackEl.scrollLeft + trackEl.clientWidth / 2;
      var best = 0;
      var bestD = Infinity;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === best); });
    }
    trackEl.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* Scroll-linked: progress bar, timeline, photo band, parallax, scroll cue */
  function initScroll() {
    var bar = qs('.progress-bar');
    var tlBox = qs('[data-timeline]');
    var band = qs('[data-band]');
    var bandTrack = band ? qs('.band-track', band) : null;
    var para = qs('[data-parallax]');
    var final = qs('.final');
    var tl = null;
    var bandPan = false;
    var scrolled = false;

    if (MOTION && tlBox) {
      tlBox.classList.add('tl-live');
      tl = { track: qs('.tl-track', tlBox), fill: qs('.tl-fill', tlBox), rider: qs('.tl-rider', tlBox), stops: qsa('.tl-stop', tlBox), dots: qsa('.tl-dot', tlBox) };
      layoutTl();
    }
    if (MOTION && HOVER && band) { band.classList.add('band-pan'); bandPan = true; }

    function layoutTl() {
      if (!tl) return;
      var box = tlBox.getBoundingClientRect();
      var pts = tl.dots.map(function (d) {
        return { x: d.offsetLeft + d.offsetWidth / 2 + d.offsetParent.offsetLeft, y: d.offsetTop + d.offsetHeight / 2 + d.offsetParent.offsetTop };
      });
      var a = pts[0];
      var b = pts[pts.length - 1];
      tl.horiz = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
      tl.a = a; tl.b = b;
      tl.len = tl.horiz ? b.x - a.x : b.y - a.y;
      tl.at = pts.map(function (p) { return tl.len ? (tl.horiz ? p.x - a.x : p.y - a.y) / tl.len : 0; });
      var s = tl.track.style;
      if (tl.horiz) { s.left = a.x + 'px'; s.top = (a.y - 1.5) + 'px'; s.width = tl.len + 'px'; s.height = '3px'; }
      else { s.left = (a.x - 1.5) + 'px'; s.top = a.y + 'px'; s.width = '3px'; s.height = tl.len + 'px'; }
      tl.boxH = box.height;
    }

    function frame() {
      ticking = false;
      var y = window.pageYOffset;
      var vh = window.innerHeight;
      var total = root.scrollHeight;
      checkDepth(y, vh, total);
      if (!MOTION) return;

      if (bar) bar.style.transform = 'scaleX(' + clamp(y / Math.max(1, total - vh), 0, 1).toFixed(4) + ')';
      if (!scrolled && y > 24) { scrolled = true; root.classList.add('scrolled'); }

      if (tl) {
        var r = tlBox.getBoundingClientRect();
        if (r.bottom > -200 && r.top < vh + 200) {
          var p = tl.horiz
            ? clamp((vh * 0.84 - (r.top + tl.a.y)) / (vh * 0.42), 0, 1)
            : clamp((vh * 0.6 - (r.top + tl.a.y)) / Math.max(1, tl.len), 0, 1);
          tl.fill.style.transform = tl.horiz ? 'scale(' + p.toFixed(4) + ',1)' : 'scale(1,' + p.toFixed(4) + ')';
          var rx = tl.a.x + (tl.horiz ? tl.len * p : 0);
          var ry = tl.a.y + (tl.horiz ? 0 : tl.len * p);
          tl.rider.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
          tl.stops.forEach(function (s, i) { s.classList.toggle('is-lit', p >= tl.at[i] - 0.015); });
        }
      }

      if (bandPan) {
        var br = band.getBoundingClientRect();
        if (br.bottom > -100 && br.top < vh + 100) {
          var bp = clamp((vh - br.top) / (vh + br.height), 0, 1);
          var tw = bandTrack.scrollWidth;
          var vw = band.clientWidth;
          var x = tw > vw ? 40 - (tw - vw + 80) * bp : (vw - tw) / 2 + 60 - 120 * bp;
          bandTrack.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
        }
      }

      if (para && HOVER) {
        var fr = final.getBoundingClientRect();
        if (fr.bottom > 0 && fr.top < vh) {
          var off = clamp((fr.top + fr.height / 2 - vh / 2) * -0.15, -fr.height * 0.085, fr.height * 0.085);
          para.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        }
      }
    }

    var ticking = false;
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { layoutTl(); onScroll(); });
    window.addEventListener('load', function () { layoutTl(); onScroll(); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { layoutTl(); onScroll(); });
    onScroll();

    /* Phones: the photo band drifts slowly on its own until touched */
    if (MOTION && !HOVER && band && HAS_IO) {
      var drifting = false;
      var stopped = false;
      var pos = 0;
      var last = 0;
      var step = function (t) {
        if (!drifting || stopped) return;
        var dt = last ? Math.min(50, t - last) : 16;
        last = t;
        pos += dt * 0.018;
        if (pos >= band.scrollWidth - band.clientWidth) { stopped = true; return; }
        band.scrollLeft = pos;
        requestAnimationFrame(step);
      };
      var kill = function () { stopped = true; };
      ['touchstart', 'pointerdown', 'wheel'].forEach(function (ev) { band.addEventListener(ev, kill, { passive: true, once: true }); });
      new IntersectionObserver(function (entries) {
        drifting = entries[0].isIntersecting;
        if (drifting && !stopped) { pos = band.scrollLeft; last = 0; requestAnimationFrame(step); }
      }, { threshold: 0.25 }).observe(band);
    }
  }

  /* =====================================================================
     5. START
     ===================================================================== */
  function start() {
    applyConfig();
    renderDates();
    initAccordions();
    initVideo();
    initCopy();
    initJump();
    initSticky();
    initReviews();
    initReveals();
    initPhotoStates();
    initTilt();
    initSpotlight();
    initScroll();
    initHeroSlides();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
  else start();
})();
