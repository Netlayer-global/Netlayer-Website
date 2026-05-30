# Netlayer Website

Marketing website for **Netlayer** — a global wholesale network carrier (Cloud Connect, IP Transit, IX Peering, DC Wave, DIA, Last Mile, EPL).

Built as a self-contained static site: plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Structure

```
.
├── index.html            # Single-page app (all pages switch via JS)
├── assets/
│   ├── css/styles.css     # Design tokens + light/dark theme + all components
│   └── js/main.js         # Page nav, theme toggle, scroll reveal, network map, FAQ
├── README.md
├── DEPLOY.md              # Full Ubuntu / static-IP deployment guide
└── .gitignore
```

## Features

- Dark + light theme with a toggle (preference saved in `localStorage`)
- 14 in-app pages (home, products + 7 product detail pages, solutions, network, interactive network map, company, contact)
- Interactive SVG network map, scroll-reveal animations, FAQ accordions
- Fully responsive (desktop, tablet, mobile)

## Run locally

It's static — any static file server works.

```bash
# Python (built in)
python3 -m http.server 5500
# then open http://localhost:5500
```

## Deploy

See **[DEPLOY.md](DEPLOY.md)** for the full Ubuntu server deployment (Nginx, custom port, static IP, optional HTTPS).
