# Wrench & Level

Static marketing site with an embedded Cal.com booking flow. Built with [Astro](https://astro.build), hosted on Cloudflare Workers.

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
| Town positions for the About page map (add one per town) | `src/data/map.ts` |
| FAQ questions and answers | `src/data/faq.ts` |
| Colors and fonts | `src/styles/global.css` |
| Shared header (with phone slide-down menu) and footer | `src/components/` |
| Pages: `/`, `/book`, `/home-services`, `/auto-services`, `/about`, `/faq`, `/booked` | `src/pages/` |

Pages are built from the Wrench & Level design canvas (desktop 1440, phone 390, one breakpoint at 768px).

**Placeholders:** a photo that isn't set yet shows as a dashed box in `npm run dev` and is left out of `npm run build`. Reviews, insurance, phone and email stay hidden until you fill them in. Photos go in `public/photos/`.

## Deploy (Cloudflare Workers)

The site deploys as a static-assets Worker, set up in `wrangler.jsonc`. In Cloudflare (Workers & Pages → Create application → import this repo):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build variable: `NODE_VERSION` = `22`

Every push to `main` deploys. Use personal accounts only.

## Booking (/book)

/book runs **Service → Parts** on the site, then shows a Cal.com embed for **time + details**, prefilled with the Parts answers. After booking, it sends people to `/booked`. Logic lives in `src/lib/booking.ts`.

Until `calUsername` is set in `src/data/site.ts`, step 3 says booking isn't open yet (in `npm run dev` it also lists the exact prefill it would send).

### Cal.com setup

1. One availability schedule (evenings and weekends), minimum notice 24 hours.
2. One event type per service. **The slug must match exactly:**

| Event slug | Length | Buffer after |
| --- | --- | --- |
| `tv-mounting` | 90 min | 30 min |
| `hanging` | 60 min | 30 min |
| `furniture-assembly` | 90 min | 30 min |
| `odd-jobs` | 60 min | 30 min |
| `brake-pads-1-axle` | 90 min | 30 min |
| `pads-rotors-1-axle` | 120 min | 30 min |
| `pads-rotors-both-axles` | 210 min | 30 min |

3. On every event type: set **Location** to **In Person (Attendee Address)** so people enter their address, and turn on the phone number field (required, for texts).
4. Add these **Short text** questions (not required; the site already checks them). **The identifier must match exactly** or the answer won't prefill:

| Event types | Question identifiers |
| --- | --- |
| `tv-mounting` | `parts-supply`, `wall-type`, `tv-size`, `hide-cords`, `trip-fee-ok` |
| `hanging` | `parts-supply`, `wall-type`, `item-count`, `trip-fee-ok` |
| `furniture-assembly` | `parts-supply`, `wall-type`, `furniture-size`, `pieces`, `trip-fee-ok` |
| `odd-jobs` | `parts-supply`, `wall-type`, `job-details`, `trip-fee-ok` |
| all 3 brake events | `parts-supply`, `vehicle`, `vin`, `part-number`, `oil-change`, `trip-fee-ok` |

5. Set `calUsername` in `src/data/site.ts`, deploy, and book a test job end to end.
