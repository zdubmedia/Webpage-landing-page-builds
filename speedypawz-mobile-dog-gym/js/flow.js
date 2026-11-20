/* Speedy PawZ: flow. The pieces that make the color fields roll into each other.
   - Ribbons: wavy marquee bands that straddle two sections.
   - Arcs: the curved top of each section flattens as it rises into view.
   - Giant type: two rows of huge words slide in opposite directions with the scroll.
   Everything here is decoration. With reduced motion or no JS the page shows the static version. */
(function () {
  'use strict';
  var SPZ = window.SPZ || {};
  var reduced = !!SPZ.reduced;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Ribbons ---- */
  var boost = 0, lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY; boost = Math.min(260, boost + Math.abs(y - lastY) * 1.6); lastY = y;
  }, { passive: true });
  $$('.ribbon').forEach(function (r) {
    var tp = r.querySelector('textPath'), phrase = r.getAttribute('data-phrase') || '';
    var REPS = 14, len = 0, off = 0, visible = false, last = 0;
    tp.textContent = new Array(REPS + 1).join(phrase);
    function measure() { try { len = tp.getComputedTextLength() / REPS; } catch (e) { len = 0; } if (len) tp.setAttribute('startOffset', -len); }
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (reduced || !('IntersectionObserver' in window)) return;
    function tick(now) {
      if (!visible) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (len) { off = (off + (42 + boost) * dt) % len; tp.setAttribute('startOffset', (-len - off).toFixed(1)); }
      boost *= 0.94;
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) { last = 0; requestAnimationFrame(tick); }
    }, { rootMargin: '80px 0px' }).observe(r);
  });

  /* ---- Arcs + giant type (scroll-scrubbed) ---- */
  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  $$('.arc').forEach(function (arc) {
    gsap.fromTo(arc, { scaleY: 1.5 }, { scaleY: 0.2, ease: 'none', scrollTrigger: { trigger: arc.parentNode, start: 'top bottom', end: 'top 30%', scrub: true } });
  });
  var giant = document.querySelector('.giant');
  if (giant) {
    gsap.fromTo('.giant__row--a', { xPercent: 3 }, { xPercent: -40, ease: 'none', scrollTrigger: { trigger: giant, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
    gsap.fromTo('.giant__row--b', { xPercent: -44 }, { xPercent: -2, ease: 'none', scrollTrigger: { trigger: giant, start: 'top bottom', end: 'bottom top', scrub: 0.4 } });
    gsap.to('.giant__sticker', { rotation: '+=40', ease: 'none', scrollTrigger: { trigger: giant, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  }
})();
