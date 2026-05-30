/* NETLAYER — shared nav + footer injected into every page (real links for SEO) */
(function () {
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (path === '') path = 'index.html';

  // map each page file to its top-level nav group for active highlighting
  var GROUP = {
    'products.html': 'products', 'cloud-connect.html': 'products', 'ip-transit.html': 'products',
    'ix-peering.html': 'products', 'dc-wave.html': 'products', 'dia.html': 'products',
    'last-mile.html': 'products', 'epl.html': 'products',
    'solutions.html': 'solutions',
    'network.html': 'network', 'network-map.html': 'network',
    'company.html': 'company', 'news.html': 'company', 'contact.html': 'company'
  };
  var active = GROUP[path] || '';

  function act(g) { return active === g ? ' class="active"' : ''; }

  var nav =
  '<nav id="mainNav">' +
    '<a class="logo" href="index.html">NETLAYER</a>' +
    '<ul class="nav-links">' +
      '<li class="has-dropdown">' +
        '<a href="products.html"' + act('products') + '>Products' +
          '<svg class="caret" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>' +
        '<div class="dropdown">' +
          '<a href="cloud-connect.html"><span class="dd-title">Cloud Connect</span><span class="dd-desc">Private Layer 2 access to all major clouds</span></a>' +
          '<a href="ip-transit.html"><span class="dd-title">IP Transit</span><span class="dd-desc">High-speed Layer 3 BGP to the global internet</span></a>' +
          '<a href="ix-peering.html"><span class="dd-title">IX Peering</span><span class="dd-desc">Direct &amp; remote Internet Exchange peering</span></a>' +
          '<a href="dc-wave.html"><span class="dd-title">DC Wave</span><span class="dd-desc">High-capacity DWDM metro connectivity</span></a>' +
          '<a href="dia.html"><span class="dd-title">Dedicated Internet Access</span><span class="dd-desc">Uncontended, dedicated internet</span></a>' +
          '<a href="last-mile.html"><span class="dd-title">Last Mile</span><span class="dd-desc">Off-net, edge &amp; remote site access</span></a>' +
          '<a href="epl.html"><span class="dd-title">Ethernet Private Line</span><span class="dd-desc">Flexible point-to-point Ethernet</span></a>' +
          '<a class="dd-all" href="products.html"><span class="dd-title">View all products &rarr;</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="has-dropdown">' +
        '<a href="solutions.html"' + act('solutions') + '>Solutions' +
          '<svg class="caret" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>' +
        '<div class="dropdown">' +
          '<a href="solutions.html"><span class="dd-title">Infrastructure Providers</span><span class="dd-desc">Resilient access to all major clouds</span></a>' +
          '<a href="solutions.html"><span class="dd-title">Digital Businesses</span><span class="dd-desc">Global IP &amp; cloud connectivity</span></a>' +
          '<a href="solutions.html"><span class="dd-title">Data Centres &amp; Hosting</span><span class="dd-desc">Scalable colocation interconnect</span></a>' +
          '<a href="solutions.html"><span class="dd-title">Cloud &amp; Content Platforms</span><span class="dd-desc">Dedicated cloud on-ramps</span></a>' +
          '<a class="dd-all" href="solutions.html"><span class="dd-title">View all solutions &rarr;</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="has-dropdown">' +
        '<a href="network.html"' + act('network') + '>Network' +
          '<svg class="caret" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>' +
        '<div class="dropdown">' +
          '<a href="network.html"><span class="dd-title">Global Backbone</span><span class="dd-desc">AS24482 &middot; 200+ PoPs worldwide</span></a>' +
          '<a href="network-map.html"><span class="dd-title">Network Map</span><span class="dd-desc">Interactive global PoP &amp; route map</span></a>' +
          '<a href="network.html"><span class="dd-title">Peering Density</span><span class="dd-desc">10,000+ peers &middot; #2 globally</span></a>' +
        '</div>' +
      '</li>' +
      '<li class="has-dropdown">' +
        '<a href="company.html"' + act('company') + '>Company' +
          '<svg class="caret" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></a>' +
        '<div class="dropdown">' +
          '<a href="company.html"><span class="dd-title">About Us</span><span class="dd-desc">25+ years, rooted in APAC</span></a>' +
          '<a href="company.html"><span class="dd-title">Our Team</span><span class="dd-desc">The experts behind the network</span></a>' +
          '<a href="news.html"><span class="dd-title">News &amp; Insights</span><span class="dd-desc">Latest updates from Netlayer HQ</span></a>' +
          '<a href="contact.html"><span class="dd-title">Contact</span><span class="dd-desc">Talk to our pre-sales team</span></a>' +
        '</div>' +
      '</li>' +
    '</ul>' +
    '<div class="nav-right">' +
      '<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle light and dark theme" title="Toggle theme">' +
        '<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.5v3M12 19.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1.5 12h3M19.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>' +
        '<svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '</button>' +
      '<a class="btn-demo" href="contact.html">Get in touch</a>' +
      '<div class="hamburger" onclick="toggleMobile()"><span></span><span></span><span></span></div>' +
    '</div>' +
  '</nav>';

  var footer =
  '<footer>' +
    '<div class="footer-brand">' +
      '<div class="logo-text">NETLAYER</div>' +
      '<p>Asia Pacific\'s friendly global wholesale carrier, delivering customisable, scalable and low-latency network solutions from edge to cloud.</p>' +
      '<div class="status-banner"><div class="status-dot"></div><div class="status-text">Network Operational &middot; AS24482</div></div>' +
    '</div>' +
    '<div class="footer-col"><h4>Products</h4><ul>' +
      '<li><a href="cloud-connect.html">Cloud Connect</a></li>' +
      '<li><a href="ip-transit.html">IP Transit</a></li>' +
      '<li><a href="ix-peering.html">IX Peering</a></li>' +
      '<li><a href="dc-wave.html">DC Wave</a></li>' +
    '</ul></div>' +
    '<div class="footer-col"><h4>Company</h4><ul>' +
      '<li><a href="company.html">About Us</a></li>' +
      '<li><a href="network-map.html">Network Map</a></li>' +
      '<li><a href="contact.html">Contact</a></li>' +
      '<li><a href="solutions.html">Solutions</a></li>' +
    '</ul></div>' +
    '<div class="footer-col"><h4>Resources</h4><ul>' +
      '<li><a href="news.html">News &amp; Insights</a></li>' +
      '<li><a href="#">Product Sheets</a></li>' +
      '<li><a href="#">Privacy Policy</a></li>' +
      '<li><a href="#">Terms of Service</a></li>' +
    '</ul></div>' +
  '</footer>' +
  '<div class="footer-bottom">' +
    '<p>&copy; 2026 Netlayer Inc. All Rights Reserved.</p>' +
    '<div class="footer-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a></div>' +
  '</div>';

  var navMount = document.getElementById('nav-mount');
  if (navMount) navMount.innerHTML = nav;
  document.querySelectorAll('.footer-slot, #footer-mount').forEach(function (el) {
    el.innerHTML = footer;
  });
})();
