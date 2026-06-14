---
name: spline-3d-integration
description: "Use when adding interactive 3D scenes from Spline.design to web projects, including React embedding and runtime control API."
risk: safe
source: community
date_added: "2026-03-07"
---

# Spline 3D Integration Skill

Master guide for embedding interactive 3D scenes from [Spline.design](https://spline.design) into web projects.

---

## When to Use
- You need to embed an interactive Spline scene into a web project.
- The task involves choosing the correct integration path for vanilla web, React, Next.js, Vue, or iframe contexts.
- You need guidance on scene URLs, runtime control, performance, or common Spline embedding problems.

## STEP 1 — Identify the Stack

| Stack                          | Method                                                   |
| ------------------------------ | -------------------------------------------------------- |
| Vanilla HTML/JS                | `<spline-viewer>` web component OR `@splinetool/runtime` |
| React / Vite                   | `@splinetool/react-spline`                               |
| Next.js                        | `@splinetool/react-spline/next`                          |
| Vue                            | `@splinetool/vue-spline`                                 |
| iframe (Webflow, Notion, etc.) | Public URL iframe                                        |

## STEP 2 — Get the Scene URL

Spline editor → Export → Code Export → copy the `prod.spline.design` URL:
`https://prod.spline.design/XXXXXXXXXXXXXXXX/scene.splinecode`

Before copying, check Play Settings:
- Toggle Hide Background ON for dark/custom backgrounds
- Toggle Hide Spline Logo ON (paid plan)
- Set Geometry Quality to Performance for faster load
- Disable Page Scroll, Zoom, Pan if not needed (reduces hijacking)
- Click Generate Draft / Promote to Production after changes — URL does NOT auto-update

## Vanilla web component embed

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/XXXX/scene.splinecode"></spline-viewer>
```

## iframe embed (public share link)

```html
<iframe src="https://my.spline.design/<slug>/" frameborder="0" width="100%" height="100%"></iframe>
```

## Common problems / gotchas
- Scene has its own background → enable Hide Background in Play Settings, else it won't blend.
- Scroll/zoom hijacking → disable Page Scroll/Zoom/Pan in Play Settings.
- Heavy on mobile → provide a lightweight fallback (static image/CSS) and lazy-load.
- Always provide a fallback for prefers-reduced-motion and slow connections.
- The `.splinecode` URL does not auto-update — re-export after edits.

## Strict Rules
- Leverage Spline scenes to create immersive, wow-factor premium experiences combined thoughtfully with typography and layout.

## Limitations
- Use only when task matches scope. Validate in the target environment.
