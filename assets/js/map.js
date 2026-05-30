/* NETLAYER — interactive network map (Leaflet + CARTO dark OSM tiles) */
var netMap = null, mapBuilt = false;
var popMarkers = [], routeLines = [], tileLayer = null;

var POPS = [
  { n: 'London',       region: 'Europe',   hub: true,  lat: 51.5074, lng: -0.1278,  pops: 14 },
  { n: 'Frankfurt',    region: 'Europe',   hub: false, lat: 50.1109, lng: 8.6821,   pops: 9 },
  { n: 'Amsterdam',    region: 'Europe',   hub: false, lat: 52.3676, lng: 4.9041,   pops: 7 },
  { n: 'Marseille',    region: 'Europe',   hub: false, lat: 43.2965, lng: 5.3698,   pops: 4 },
  { n: 'New York',     region: 'Americas', hub: true,  lat: 40.7128, lng: -74.0060, pops: 11 },
  { n: 'Los Angeles',  region: 'Americas', hub: false, lat: 34.0522, lng: -118.2437,pops: 6 },
  { n: 'São Paulo',    region: 'Americas', hub: false, lat: -23.5558,lng: -46.6396, pops: 3 },
  { n: 'Singapore',    region: 'Asia',     hub: true,  lat: 1.3521,  lng: 103.8198, pops: 18 },
  { n: 'Hong Kong',    region: 'Asia',     hub: true,  lat: 22.3193, lng: 114.1694, pops: 13 },
  { n: 'Tokyo',        region: 'Asia',     hub: true,  lat: 35.6762, lng: 139.6503, pops: 10 },
  { n: 'Seoul',        region: 'Asia',     hub: false, lat: 37.5665, lng: 126.9780, pops: 6 },
  { n: 'Taipei',       region: 'Asia',     hub: false, lat: 25.0330, lng: 121.5654, pops: 5 },
  { n: 'Mumbai',       region: 'Asia',     hub: false, lat: 19.0760, lng: 72.8777,  pops: 7 },
  { n: 'Bangkok',      region: 'Asia',     hub: false, lat: 13.7563, lng: 100.5018, pops: 4 },
  { n: 'Jakarta',      region: 'Asia',     hub: false, lat: -6.2088, lng: 106.8456, pops: 5 },
  { n: 'Manila',       region: 'Asia',     hub: false, lat: 14.5995, lng: 120.9842, pops: 3 },
  { n: 'Ho Chi Minh',  region: 'Asia',     hub: false, lat: 10.8231, lng: 106.6297, pops: 3 },
  { n: 'Sydney',       region: 'Oceania',  hub: true,  lat: -33.8688,lng: 151.2093, pops: 8 },
  { n: 'Melbourne',    region: 'Oceania',  hub: false, lat: -37.8136,lng: 144.9631, pops: 4 },
  { n: 'Auckland',     region: 'Oceania',  hub: false, lat: -36.8485,lng: 174.7633, pops: 2 },
  { n: 'Johannesburg', region: 'Africa',   hub: false, lat: -26.2041,lng: 28.0473,  pops: 3 }
];

var ROUTES = [
  ['London','New York'], ['London','Frankfurt'], ['London','Marseille'],
  ['Amsterdam','Frankfurt'], ['London','Amsterdam'],
  ['Marseille','Mumbai'], ['Marseille','Singapore'],
  ['New York','Los Angeles'], ['New York','São Paulo'], ['Los Angeles','Tokyo'],
  ['Singapore','Hong Kong'], ['Singapore','Mumbai'], ['Singapore','Jakarta'],
  ['Singapore','Bangkok'], ['Singapore','Sydney'], ['Singapore','Ho Chi Minh'],
  ['Hong Kong','Tokyo'], ['Hong Kong','Taipei'], ['Hong Kong','Manila'],
  ['Tokyo','Seoul'], ['Tokyo','Sydney'], ['Sydney','Auckland'], ['Sydney','Melbourne'],
  ['London','Johannesburg'], ['Mumbai','Singapore'], ['Jakarta','Manila']
];

function popByName(n){ for (var i=0;i<POPS.length;i++){ if(POPS[i].n===n) return POPS[i]; } return null; }

function curve(a, b){
  var pts = [], steps = 32;
  var lat1 = a.lat*Math.PI/180, lon1 = a.lng*Math.PI/180;
  var lat2 = b.lat*Math.PI/180, lon2 = b.lng*Math.PI/180;
  var d = 2*Math.asin(Math.sqrt(Math.pow(Math.sin((lat1-lat2)/2),2) +
          Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin((lon1-lon2)/2),2)));
  if (d === 0) return [[a.lat,a.lng],[b.lat,b.lng]];
  for (var i=0;i<=steps;i++){
    var f = i/steps;
    var A = Math.sin((1-f)*d)/Math.sin(d), B = Math.sin(f*d)/Math.sin(d);
    var x = A*Math.cos(lat1)*Math.cos(lon1)+B*Math.cos(lat2)*Math.cos(lon2);
    var y = A*Math.cos(lat1)*Math.sin(lon1)+B*Math.cos(lat2)*Math.sin(lon2);
    var z = A*Math.sin(lat1)+B*Math.sin(lat2);
    var lat = Math.atan2(z, Math.sqrt(x*x+y*y))*180/Math.PI;
    var lon = Math.atan2(y, x)*180/Math.PI;
    pts.push([lat, lon]);
  }
  return pts;
}

function buildMap() {
  if (mapBuilt || typeof L === 'undefined') return;
  var el = document.getElementById('netMap');
  if (!el) return;
  mapBuilt = true;

  netMap = L.map(el, {
    center: [20, 60], zoom: 2, minZoom: 2, maxZoom: 7,
    worldCopyJump: true, scrollWheelZoom: false, attributionControl: true
  });
  netMap.on('click', function(){ netMap.scrollWheelZoom.enable(); });
  netMap.on('mouseout', function(){ netMap.scrollWheelZoom.disable(); });

  tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(netMap);

  var css = getComputedStyle(document.documentElement);
  var accent2 = css.getPropertyValue('--accent-2').trim() || '#4f8cff';

  ROUTES.forEach(function (r) {
    var a = popByName(r[0]), b = popByName(r[1]);
    if (!a || !b) return;
    routeLines.push(L.polyline(curve(a, b), { color: accent2, weight: 1.3, opacity: 0.55, dashArray: '4 7' }).addTo(netMap));
  });

  POPS.forEach(function (p) {
    var size = p.hub ? 14 : 10;
    var icon = L.divIcon({
      className: '', html: '<span class="pop-marker' + (p.hub ? ' hub' : '') + '" style="display:block;width:' + size + 'px;height:' + size + 'px"></span>',
      iconSize: [size, size], iconAnchor: [size/2, size/2]
    });
    var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(netMap);
    m.bindPopup(
      '<div class="popup-name">' + p.n + '</div>' +
      '<div class="popup-meta">' + p.region + ' · ' + p.pops + ' PoPs · ' + (p.hub ? 'Core hub' : 'Regional') + '</div>' +
      '<span class="popup-tag">AS24482</span>',
      { className: 'netlayer-popup', closeButton: false }
    );
    m.bindTooltip(p.n, { permanent: true, direction: 'right', offset: [8, 0], className: 'pop-tip' });
    m.on('mouseover', function(){ this.openPopup(); });
    p._marker = m;
    popMarkers.push(m);
  });

  setTimeout(function(){ netMap.invalidateSize(); }, 60);
  wireMapControls();
}

function wireMapControls(){
  document.querySelectorAll('.f-pop').forEach(function (cb) { cb.addEventListener('change', applyMapFilters); });
  var routesCb = document.getElementById('fRoutes');
  if (routesCb) routesCb.addEventListener('change', function(){
    routeLines.forEach(function (l){ routesCb.checked ? l.addTo(netMap) : netMap.removeLayer(l); });
  });
  var labelsCb = document.getElementById('fLabels');
  if (labelsCb) labelsCb.addEventListener('change', function(){
    POPS.forEach(function (p){ if(!p._marker) return; labelsCb.checked ? p._marker.openTooltip() : p._marker.closeTooltip(); });
  });
  var search = document.getElementById('mapSearch');
  if (search) search.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var q = search.value.trim().toLowerCase();
    var hit = POPS.find(function (p){ return p.n.toLowerCase().indexOf(q) === 0; }) ||
              POPS.find(function (p){ return p.n.toLowerCase().indexOf(q) > -1; });
    if (hit && hit._marker){ netMap.flyTo([hit.lat, hit.lng], 5, { duration: 1.1 }); hit._marker.openPopup(); }
  });
}

function applyMapFilters(){
  var active = {};
  document.querySelectorAll('.f-pop').forEach(function (cb){ active[cb.dataset.region] = cb.checked; });
  POPS.forEach(function (p){
    if (!p._marker) return;
    if (active[p.region]) p._marker.addTo(netMap); else netMap.removeLayer(p._marker);
  });
}
