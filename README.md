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
| Phone, email, towns, insurance, years installing, reviews, photos | `src/data/site.ts` (leave `null` or empty to keep hidden) |
| FAQ questions and answers | `src/data/faq.ts` |
| Colors and fonts | `src/styles/global.css` |
| Shared header (with phone slide-down menu) and footer | `src/components/` |
| Pages: `/`, `/book`, `/home-services`, `/auto-services`, `/about`, `/faq`, `/booked` | `src/pages/` |

Pages are built from the Wrench & Level design canvas (desktop 1440, phone 390, one breakpoint at 768px).

**Placeholders:** a photo that isn't set yet shows as a dashed box in `npm run dev` and is left out of `npm run build`. Reviews, insurance, phone and email stay hidden until you fill them in. Photos go in `public/photos/`.

## Deploy (Cloudflare Pages)

Connect this repo in Cloudflare Pages with:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

Every push to the main branch deploys. Use personal accounts only.
