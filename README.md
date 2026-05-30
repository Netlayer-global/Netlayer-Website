# Netlayer Website

Marketing website for **Netlayer** — a global wholesale network carrier (Cloud Connect, IP Transit, IX Peering, DC Wave, DIA, Last Mile, EPL).

Built as a self-contained static site: plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Structure

```
.
├── index.html             # Home
├── products.html          # Products overview
├── cloud-connect.html     # Product detail pages
├── ip-transit.html
├── ix-peering.html
├── dc-wave.html
├── dia.html
├── last-mile.html
├── epl.html
├── solutions.html         # Solutions
├── network.html           # Our network
├── network-map.html       # Interactive Leaflet map
├── company.html           # About + team + values
├── news.html              # News & insights
├── contact.html           # Enquiry form
├── assets/
│   ├── css/styles.css      # Design tokens + light/dark theme + components
│   ├── js/partials.js      # Shared nav + footer (injected on every page)
│   ├── js/main.js          # Theme toggle, scroll reveal, counters, FAQ, form
│   └── js/map.js           # Leaflet network map (map page only)
├── robots.txt · sitemap.xml
├── README.md · DEPLOY.md
```

Each page is a real, independently-indexable HTML file with its own `<title>`,
meta description and Open Graph tags. The nav and footer are injected by
`partials.js` so they stay consistent across all pages — edit once, applies everywhere.

## Run locally

It's static — any static file server works.

```bash
# Python (built in)
python3 -m http.server 5500
# then open http://localhost:5500
```

## Deploy

See **[DEPLOY.md](DEPLOY.md)** for the full Ubuntu server deployment (Nginx, custom port, static IP, optional HTTPS).
