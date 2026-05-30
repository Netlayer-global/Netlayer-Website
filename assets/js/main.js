/* NETLAYER — single-page app navigation & interactions */

// ─── Shared footer (injected into every .footer-slot) ───
var FOOTER_HTML = `
  <footer>
    <div class="footer-brand">
      <div class="logo-text">NETLAYER</div>
      <p>Asia Pacific's friendly global wholesale carrier, delivering customisable, scalable and low-latency network solutions from edge to cloud.</p>
      <div class="status-banner">
        <div class="status-dot"></div>
        <div class="status-text">Network Operational · AS24482</div>
      </div>
    </div>
    <div class="footer-col">
      <h4>Products</h4>
      <ul>
        <li><a onclick="goPage('cloud-connect')">Cloud Connect</a></li>
        <li><a onclick="goPage('ip-transit')">IP Transit</a></li>
        <li><a onclick="goPage('ix-peering')">IX Peering</a></li>
        <li><a onclick="goPage('dc-wave')">DC Wave</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a onclick="goPage('company')">About Us</a></li>
        <li><a onclick="goPage('network-map')">Network Map</a></li>
        <li><a onclick="goPage('contact')">Contact</a></li>
        <li><a onclick="goPage('solutions')">Solutions</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Resources</h4>
      <ul>
        <li><a href="#">Product Sheets</a></li>
        <li><a href="#">PoP List</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
      </ul>
    </div>
  </footer>
  <div class="footer-bottom">
    <p>© 2026 Netlayer Inc. All Rights Reserved.</p>
    <div class="footer-bottom-links">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>`;

document.querySelectorAll('.footer-slot').forEach(function (slot) {
  slot.innerHTML = FOOTER_HTML;
});

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

// ─── Scroll nav background ───
window.addEventListener('scroll', function () {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ─── Page navigation ───
// Maps detail pages back to their top-level nav item for active highlighting
var NAV_GROUP = {
  'products': 'products', 'cloud-connect': 'products', 'ip-transit': 'products',
  'ix-peering': 'products', 'dc-wave': 'products', 'dia': 'products',
  'last-mile': 'products', 'epl': 'products',
  'solutions': 'solutions', 'network': 'network', 'network-map': 'network',
  'company': 'company', 'contact': 'company'
};

function goPage(name) {
  var target = document.getElementById('page-' + name);
  if (!target) return;
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  target.classList.add('active');

  var group = NAV_GROUP[name] || name;
  document.querySelectorAll('.nav-links > li > a').forEach(function (a) {
    a.classList.toggle('active', a.dataset.page === group);
  });

  document.querySelector('.nav-links')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'instant' });

  // re-trigger reveals for the newly shown page
  requestAnimationFrame(function () { runReveal(target); });
}

// ─── Mobile menu toggle ───
function toggleMobile() {
  document.querySelector('.nav-links')?.classList.toggle('open');
}

// ─── Scroll reveal ───
var revealObserver = null;
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
}

// auto-tag content blocks so we don't hand-edit every element
var REVEAL_SELECTORS = [
  '.section > .eyebrow', '.section .two-col > div', '.section-sm > .eyebrow',
  '.section-sm > .section-heading-sm', '.cards-grid > .card', '.adv-list > .adv-item',
  '.prod-highlights > .ph-cell', '.dashboard-inner', '.stats-grid > .stat-cell',
  '.map-grid > .map-node', '.region-grid > .region-cell', '.team-grid > .team-card',
  '.pricing-grid > .pricing-card', '.tl-item', '.cta-banner > div'
];
function tagReveals(scope) {
  var root = scope || document;
  REVEAL_SELECTORS.forEach(function (sel) {
    root.querySelectorAll(sel).forEach(function (el, i) {
      if (!el.classList.contains('reveal') && !el.dataset.noReveal) {
        el.classList.add('reveal');
        var grp = i % 4; if (grp) el.setAttribute('data-delay', grp);
      }
    });
  });
}
function runReveal(scope) {
  var root = scope || document;
  tagReveals(root);
  var items = root.querySelectorAll('.reveal:not(.in)');
  if (!revealObserver) { items.forEach(function (i) { i.classList.add('in'); }); return; }
  items.forEach(function (i) { revealObserver.observe(i); });
}

// ─── Interactive Network Map ───
function buildMap() {
  var world = document.getElementById('worldDots');
  if (!world || world.dataset.built) return;
  world.dataset.built = '1';
  var svgNS = 'http://www.w3.org/2000/svg';

  // simple dot-grid landmass silhouette (very rough world shape, decorative)
  var W = 1000, H = 480, step = 13;
  function land(x, y) {
    // normalize to 0..1
    var nx = x / W, ny = y / H;
    // Americas
    if (nx > 0.10 && nx < 0.30 && ny > 0.22 && ny < 0.86) return true;
    if (nx > 0.16 && nx < 0.27 && ny > 0.55 && ny < 0.92) return true;
    // Europe / Africa
    if (nx > 0.44 && nx < 0.58 && ny > 0.18 && ny < 0.82) return true;
    // Asia
    if (nx > 0.58 && nx < 0.86 && ny > 0.18 && ny < 0.62) return true;
    // SE Asia / Oceania
    if (nx > 0.78 && nx < 0.93 && ny > 0.55 && ny < 0.82) return true;
    return false;
  }
  for (var y = 30; y < H - 20; y += step) {
    for (var x = 20; x < W - 20; x += step) {
      if (land(x, y)) {
        var d = document.createElementNS(svgNS, 'circle');
        d.setAttribute('cx', x); d.setAttribute('cy', y); d.setAttribute('r', 1.6);
        d.setAttribute('class', 'world-dot');
        world.appendChild(d);
      }
    }
  }

  // PoP coordinates (x,y in viewBox) — hub=core, alt=regional
  var pops = [
    { n: 'London', x: 488, y: 168, hub: true },
    { n: 'New York', x: 250, y: 190, hub: true },
    { n: 'Singapore', x: 792, y: 350, hub: true },
    { n: 'Hong Kong', x: 808, y: 300, hub: true },
    { n: 'Tokyo', x: 858, y: 240, hub: false },
    { n: 'Sydney', x: 880, y: 410, hub: false },
    { n: 'Mumbai', x: 712, y: 312, hub: false },
    { n: 'Taipei', x: 828, y: 286, hub: false },
    { n: 'Jakarta', x: 800, y: 372, hub: false },
    { n: 'Seoul', x: 845, y: 232, hub: false },
    { n: 'Johannesburg', x: 545, y: 412, hub: false },
    { n: 'Bangkok', x: 778, y: 322, hub: false }
  ];
  var byName = {};
  pops.forEach(function (p) { byName[p.n] = p; });

  var routes = [
    ['London', 'New York'], ['London', 'Singapore'], ['London', 'Mumbai'],
    ['Singapore', 'Hong Kong'], ['Singapore', 'Sydney'], ['Singapore', 'Jakarta'],
    ['Singapore', 'Mumbai'], ['Singapore', 'Bangkok'], ['Hong Kong', 'Tokyo'],
    ['Hong Kong', 'Taipei'], ['Tokyo', 'Seoul'], ['Tokyo', 'New York'],
    ['London', 'Johannesburg'], ['Hong Kong', 'Singapore']
  ];
  var routeLayer = document.getElementById('routeLayer');
  routes.forEach(function (r) {
    var a = byName[r[0]], b = byName[r[1]];
    if (!a || !b) return;
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 40; // curve control
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y);
    path.setAttribute('class', 'map-route');
    routeLayer.appendChild(path);
  });

  var popLayer = document.getElementById('popLayer');
  pops.forEach(function (p) {
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'pop-dot' + (p.hub ? '' : ' alt'));
    g.setAttribute('transform', 'translate(' + p.x + ',' + p.y + ')');
    var ring = document.createElementNS(svgNS, 'circle');
    ring.setAttribute('class', 'ring'); ring.setAttribute('r', p.hub ? 5 : 4);
    var core = document.createElementNS(svgNS, 'circle');
    core.setAttribute('class', 'core'); core.setAttribute('r', p.hub ? 4 : 3);
    var lbl = document.createElementNS(svgNS, 'text');
    lbl.setAttribute('class', 'lbl'); lbl.setAttribute('x', 9); lbl.setAttribute('y', 4);
    lbl.textContent = p.n;
    g.appendChild(ring); g.appendChild(core); g.appendChild(lbl);
    popLayer.appendChild(g);
  });
}
buildMap();

// ─── Contact form (demo handler) ───
document.addEventListener('submit', function (e) {
  if (e.target && e.target.id === 'contact-form') {
    e.preventDefault();
    var btn = e.target.querySelector('[type=submit]');
    if (!btn) return;
    var original = btn.textContent;
    btn.textContent = 'Enquiry Sent ✓';
    btn.disabled = true;
    e.target.reset();
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 3200);
  }
});

// ─── FAQ accordion ───
document.addEventListener('click', function (e) {
  var q = e.target.closest('.faq-q');
  if (!q) return;
  var item = q.closest('.faq-item');
  if (item) item.classList.toggle('open');
});

// ─── Initial reveal on first paint ───
runReveal(document.querySelector('.page.active') || document);
