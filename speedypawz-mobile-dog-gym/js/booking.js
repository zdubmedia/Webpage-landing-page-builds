/* Speedy PawZ booking: tabs, 3-step session request, quick-call request.
   Submits to Netlify Forms with fetch, then goes to thank-you.html. */
(function () {
  'use strict';
  var CFG = window.SPZ_CONFIG || {};
  var SPZ = window.SPZ || {};
  var REDUCED = !!SPZ.reduced;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PHONE = (CFG.business && CFG.business.phoneDisplay) || '(530) 808-5782';
  var PHONE_LINK = 'sms:' + ((CFG.business && CFG.business.phoneE164) || '+15308085782');

  /* ---------- Tabs ---------- */
  var tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- Calendar embed (optional) ---------- */
  var cal = CFG.calendarEmbed;
  if (cal && cal.src) {
    var slot = $('#calendarSlot');
    var f = document.createElement('iframe');
    f.src = cal.src; f.title = 'Book a Speedy PawZ session' + (cal.name ? ' (' + cal.name + ')' : '');
    f.height = cal.height || 760; f.loading = 'lazy';
    slot.appendChild(f); slot.hidden = false;
    var t = $('.calendar-fallback-title'); if (t) t.hidden = false;
  }

  /* ---------- Helpers ---------- */
  function digits(v) { var d = String(v || '').replace(/\D/g, ''); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d; }
  function formatPhone(v) {
    var d = digits(v).slice(0, 10);
    if (d.length < 4) return d.length ? '(' + d : '';
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }
  $$('input[type="tel"]').forEach(function (i) {
    i.addEventListener('input', function (e) {
      if (e.inputType && e.inputType.indexOf('delete') === 0) return;
      i.value = formatPhone(i.value);
    });
    i.addEventListener('blur', function () { if (digits(i.value).length === 10) i.value = formatPhone(i.value); });
  });

  function setErr(input, errEl, msg) {
    if (errEl) errEl.textContent = msg || '';
    if (input) {
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    return !msg;
  }
  // Clear an error as soon as someone fixes it
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.closest || !el.closest('form')) return;
    if (el.getAttribute('aria-invalid') === 'true') { el.removeAttribute('aria-invalid'); var id = el.getAttribute('aria-describedby'); if (id && document.getElementById(id)) document.getElementById(id).textContent = ''; }
    var fs = el.closest('fieldset.field'); if (fs) { var id2 = fs.getAttribute('aria-describedby'); if (id2 && document.getElementById(id2)) document.getElementById(id2).textContent = ''; }
    var tc = el.closest('.time-choice'); if (tc) { var er = $('.err', tc); if (er) er.textContent = ''; }
  });
  function checked(form, name) { var c = $('input[name="' + name + '"]:checked', form); return c ? c.value : ''; }
  function joinChecks(form) {
    $$('[data-join]', form).forEach(function (wrap) {
      var vals = $$('input[type="checkbox"]:checked', wrap).map(function (c) {
        // "Something else" carries whatever they typed in the box it opens
        var more = c.getAttribute('data-reveal') && document.querySelector('#' + c.getAttribute('data-reveal') + ' input');
        var typed = more ? more.value.split(/\s+/).join(' ').trim() : '';
        return typed ? 'Other: ' + typed : c.value;
      });
      var hidden = $('input[name="' + wrap.getAttribute('data-join') + '"]', form);
      if (hidden) hidden.value = vals.join(', ');
    });
  }

  // A chip with data-reveal opens a small write-in box (the "Something else" option)
  $$('input[data-reveal]').forEach(function (c) {
    var box = document.getElementById(c.getAttribute('data-reveal'));
    if (!box) return;
    c.addEventListener('change', function () {
      box.hidden = !c.checked;
      var inp = $('input', box);
      if (c.checked && inp) { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }
    });
    box.hidden = !c.checked;
  });

  /* ---------- Dates ---------- */
  var today = SPZ.caToday ? SPZ.caToday : function (o) { return new Date(Date.now() + (o || 0) * 864e5).toISOString().slice(0, 10); };
  var winDays = +CFG.bookingWindowDays || 7;
  var minD = today(1), maxD = today(winDays);
  $$('input[type="date"]').forEach(function (i) { i.min = minD; i.max = maxD; });
  function niceDate(s) { var d = new Date(s + 'T12:00:00'); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
  function dateProblem(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Please pick a day.';
    if (v < minD || v > maxD) return 'Please pick a day between ' + niceDate(minD) + ' and ' + niceDate(maxD) + '.';
    if (Array.isArray(CFG.serviceDays) && CFG.serviceDays.length) {
      var wd = new Date(v + 'T12:00:00').getDay();
      if (CFG.serviceDays.indexOf(wd) === -1) return "Emelyn isn't out on " + new Date(v + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }) + 's. Try another day.';
    }
    return '';
  }

  /* ---------- Session request: steps ---------- */
  var form = $('#sessionForm');
  var card = $('#sessionCard');
  var steps = $$('.step', form);
  var progress = $$('.paws-progress li', card);
  var status = $('#stepStatus');
  var btnBack = $('.js-back', form), btnNext = $('.js-next', form), btnSubmit = $('.js-submit', form);
  var current = 1, nudged = false;
  var NAMES = ['Your pup', 'Times', 'You'];

  function showStep(n, focus) {
    current = n;
    steps.forEach(function (s) {
      var on = +s.getAttribute('data-step') === n;
      s.hidden = !on; s.classList.toggle('is-active', on);
    });
    progress.forEach(function (li, i) {
      li.classList.toggle('is-current', i === n - 1);
      li.classList.toggle('is-done', i < n - 1);
      if (i === n - 1) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    btnBack.hidden = n === 1;
    btnNext.hidden = n === 3;
    btnSubmit.hidden = n !== 3;
    status.textContent = 'Step ' + n + ' of 3: ' + NAMES[n - 1];
    if (focus) {
      var top = card.getBoundingClientRect().top + window.scrollY - 24;
      if (card.getBoundingClientRect().top < 0) window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });
      var legend = $('.step:not([hidden]) .step__title', form);
      if (legend) { legend.tabIndex = -1; legend.focus({ preventScroll: true }); }
    }
  }
  SPZ.showStep = function (n) { showStep(n); };

  function validateStep(n) {
    var ok = true, first = null;
    function fail(el) { ok = false; if (!first) first = el; }
    if (n === 1) {
      var dn = $('#dog_name');
      if (!setErr(dn, $('#dog_name-err'), dn.value.trim() ? '' : "What's your pup's name?")) fail(dn);
    }
    if (n === 2) {
      var anySvc = $$('#servicesList input:checked').length > 0;
      var sf = $('#servicesField');
      if (!setErr(null, $('#services-err'), anySvc ? '' : 'Pick at least one so Emelyn knows what you have in mind.')) fail($('#servicesList input'));
      sf.toggleAttribute('data-invalid', !anySvc);

      var d1 = $('#time1_date'), w1 = checked(form, 'time1_window'), e1 = $('#time1-err');
      var p1 = d1.value ? dateProblem(d1.value) : 'Pick a day for your first choice.';
      if (p1) { setErr(d1, e1, p1); fail(d1); }
      else if (!w1) { setErr(d1, null, ''); e1.textContent = 'Pick a time of day for your first choice.'; fail($('input[name="time1_window"]')); }
      else setErr(d1, e1, '');

      var d2 = $('#time2_date'), w2 = checked(form, 'time2_window'), e2 = $('#time2-err');
      e2.classList.remove('err--soft');
      if (d2.value || w2) {
        var p2 = d2.value ? dateProblem(d2.value) : 'Pick a day for your second choice too.';
        if (p2) { setErr(d2, e2, p2); fail(d2); }
        else if (!w2) { e2.textContent = 'Pick a time of day for your second choice.'; fail($('input[name="time2_window"]')); }
        else setErr(d2, e2, '');
      } else if (ok && !nudged) {
        nudged = true;
        e2.classList.add('err--soft');
        e2.textContent = 'A second choice helps Emelyn fit you in faster. Add one, or tap Next to skip.';
        ok = false; first = d2;
      } else { setErr(d2, e2, ''); }
    }
    if (n === 3) {
      var fn = $('#first_name');
      if (!setErr(fn, $('#first_name-err'), fn.value.trim() ? '' : "What's your first name?")) fail(fn);
      var ph = $('#phone'), pd = digits(ph.value);
      var pm = !pd.length ? 'Please add a mobile number so Emelyn can reach you.' : pd.length !== 10 ? 'That number looks a little short. Try all 10 digits.' : '';
      if (!setErr(ph, $('#phone-err'), pm)) fail(ph);
      var em = $('#email'), ev = em.value.trim();
      var emsg = ev && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ev) ? 'That email looks off. Mind checking it?' : (!ev && checked(form, 'contact_pref') === 'Email' ? 'Add your email, or pick Text or Call.' : '');
      if (!setErr(em, $('#email-err'), emsg)) fail(em);
      var city = checked(form, 'city');
      if (!setErr(null, $('#city-err'), city ? '' : 'Which city are you in?')) fail($('input[name="city"]'));
    }
    if (first) {
      first.focus({ preventScroll: true });
      var r = first.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 80) first.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
    }
    return ok;
  }

  btnNext.addEventListener('click', function () { if (validateStep(current)) showStep(current + 1, true); });
  btnBack.addEventListener('click', function () { showStep(current - 1, true); });
  showStep(1);

  /* ---------- Submit ---------- */
  function encode(f) { return new URLSearchParams(new FormData(f)).toString(); }
  function showError(f, msg) {
    var box = $('.form-error', f);
    box.innerHTML = '';
    box.appendChild(document.createTextNode(msg + ' '));
    var a = document.createElement('a'); a.href = PHONE_LINK; a.textContent = 'Text Emelyn at ' + PHONE + '.';
    box.appendChild(a);
    box.hidden = false;
  }
  function send(f, firstName, type, btn, label) {
    var source = $('input[name="source"]', f);
    if (source && !source.value) source.value = SPZ.source || 'direct';
    btn.disabled = true; btn.textContent = 'Sending...';
    $('.form-error', f).hidden = true;
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encode(f) })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var url = 'thank-you.html?name=' + encodeURIComponent(firstName.trim().split(' ')[0].slice(0, 40)) + (type ? '&type=' + type : '');
        if (REDUCED) { location.href = url; return; }
        var wipe = $('.flag-wipe'); wipe.classList.add('is-on');
        setTimeout(function () { location.href = url; }, 560);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = label;
        showError(f, "Hmm, that didn't send. Please try again in a moment.");
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (current < 3) { if (validateStep(current)) showStep(current + 1, true); return; }
    if (!validateStep(3)) return;
    joinChecks(form);
    var dog = $('#dog_name').value.trim(), city = checked(form, 'city');
    $('input[name="subject"]', form).value = 'New Speedy PawZ request: ' + dog + ' (' + city + ')';
    send(form, $('#first_name').value, '', btnSubmit, 'Send my request');
  });

  /* ---------- Quick call ---------- */
  var callForm = $('#callForm');
  callForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    var fn = $('#c_first_name'), ph = $('#c_phone'), pd = digits(ph.value);
    if (!setErr(fn, $('#c_first_name-err'), fn.value.trim() ? '' : "What's your first name?")) { ok = false; first = first || fn; }
    var pm = !pd.length ? 'Please add a mobile number so Emelyn can call you.' : pd.length !== 10 ? 'That number looks a little short. Try all 10 digits.' : '';
    if (!setErr(ph, $('#c_phone-err'), pm)) { ok = false; first = first || ph; }
    var ct = checked(callForm, 'call_time');
    if (!setErr(null, $('#c_time-err'), ct ? '' : 'When is a good time to call?')) { ok = false; first = first || $('input[name="call_time"]', callForm); }
    if (!ok) { first.focus(); return; }
    var dog = $('#c_dog_name').value.trim();
    $('input[name="subject"]', callForm).value = 'New Speedy PawZ call request: ' + (dog || fn.value.trim()) + ' (' + ct + ')';
    send(callForm, fn.value, 'call', $('.js-submit', callForm), 'Request my call');
  });
})();
