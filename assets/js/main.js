/* NETLAYER — shared interactions (multi-page) */

// ─── Theme toggle ───
function toggleTheme() {
  var isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('netlayer-theme', 'dark'); } catch (e) {}
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.setItem('netlayer-theme', 'light'); } catch (e) {}
  }
}

// ─── Mobile menu toggle ───
function toggleMobile() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

// ─── Scroll nav background ───
window.addEventListener('scroll', function () {
  var nav = document.getElementById('mainNav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ─── Scroll reveal ───
var revealObserver = ('IntersectionObserver' in window)
  ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
  : null;

var REVEAL_SELECTORS = [
  '.section > .eyebrow', '.section .two-col > div', '.section-sm > .eyebrow',
  '.section-sm > .section-heading-sm', '.cards-grid > .card', '.adv-list > .adv-item',
  '.prod-highlights > .ph-cell', '.dashboard-inner', '.stats-grid > .stat-cell',
  '.map-grid > .map-node', '.region-grid > .region-cell', '.team-grid > .team-card',
  '.pricing-grid > .pricing-card', '.tl-item', '.cta-banner > div',
  '.trust-strip > .trust-cell', '.news-grid > .news-card', '.values-grid > .value-cell',
  '.logo-wall > .logo-tile'
];
function tagReveals(root) {
  REVEAL_SELECTORS.forEach(function (sel) {
    root.querySelectorAll(sel).forEach(function (el, i) {
      if (!el.classList.contains('reveal') && !el.dataset.noReveal) {
        el.classList.add('reveal');
        var grp = i % 4; if (grp) el.setAttribute('data-delay', grp);
      }
    });
  });
}
function runReveal(root) {
  root = root || document;
  tagReveals(root);
  var items = root.querySelectorAll('.reveal:not(.in)');
  if (!revealObserver) { items.forEach(function (i) { i.classList.add('in'); }); return; }
  items.forEach(function (i) { revealObserver.observe(i); });
}

// ─── Animated number counters ───
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  var target = parseFloat(el.dataset.count);
  var suffix = el.dataset.suffix || '';
  var dur = 1400, start = performance.now();
  function tick(now) {
    var p = Math.min((now - start) / dur, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick); else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}
var counterObserver = ('IntersectionObserver' in window)
  ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); counterObserver.unobserve(en.target); }
      });
    }, { threshold: 0.5 })
  : null;
function wireCounters(root) {
  (root || document).querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    if (counterObserver) counterObserver.observe(el); else animateCounter(el);
  });
}

// ─── FAQ accordion ───
document.addEventListener('click', function (e) {
  var q = e.target.closest('.faq-q');
  if (!q) return;
  var item = q.closest('.faq-item');
  if (item) item.classList.toggle('open');
});

// ─── Contact form (Web3Forms — set your access key to go live) ───
document.addEventListener('submit', function (e) {
  if (!(e.target && e.target.id === 'contact-form')) return;
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector('[type=submit]');
  if (!btn) return;
  var original = btn.textContent;
  var keyField = form.querySelector('input[name="access_key"]');
  var hasKey = keyField && keyField.value && keyField.value.indexOf('YOUR_') !== 0;
  btn.disabled = true; btn.textContent = 'Sending…';
  if (hasKey) {
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    }).then(function (r) { return r.json(); }).then(function (d) {
      btn.textContent = d.success ? 'Enquiry Sent ✓' : 'Try Again';
      if (d.success) form.reset();
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 3500);
    }).catch(function () {
      btn.textContent = 'Try Again'; btn.disabled = false;
      setTimeout(function () { btn.textContent = original; }, 3500);
    });
  } else {
    setTimeout(function () {
      btn.textContent = 'Enquiry Sent ✓'; form.reset();
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 3200);
    }, 600);
  }
});

// ─── Init on load ───
document.addEventListener('DOMContentLoaded', function () {
  runReveal(document);
  wireCounters(document);
  if (document.getElementById('netMap')) buildMap();
});
