# Wrench & Level

Static marketing site with an embedded Cal.com booking flow. Built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview  # serve the built site
```

## Where things live

| What | File |
| --- | --- |
| Prices (labor), add-ons, parts markup, trip fee, event durations | `src/data/prices.json` |
| Phone, email, towns, insurance, Cal.com username | `src/data/site.ts` (leave `null` to keep hidden) |
| Colors and fonts | `src/styles/global.css` |
| Shared header (with phone slide-down menu) and footer | `src/components/` |
| Pages: `/`, `/book`, `/home-services`, `/auto-services`, `/about`, `/faq`, `/booked` | `src/pages/` |

Sections marked "To build" are placeholders for the design canvas.

## Deploy (Cloudflare Pages)

Connect this repo in Cloudflare Pages with:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

Every push to the main branch deploys. Use personal accounts only.
