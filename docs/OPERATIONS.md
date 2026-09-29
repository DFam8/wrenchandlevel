# Wrench & Level — operations guide

How the site, domain, email and booking are set up, which account owns each piece, and how to change them. Written 2026-09-29, when all of it was first put together.

Everything here uses **personal accounts only**. Nothing for Wrench & Level lives on a Gigantic Design account.

## At a glance

| Piece | Service | Account | Where to manage it |
| --- | --- | --- | --- |
| Code | GitHub, repo `DFam8/wrenchandlevel` | DFam8 (personal) | github.com/DFam8/wrenchandlevel |
| Hosting | Cloudflare Workers (static assets) | ldavid20@gmail.com | Cloudflare → Workers & Pages → `wrenchandlevel` |
| Domain registration | GoDaddy | Luke's GoDaddy | GoDaddy → My Products → wrenchandlevel.com |
| DNS, redirects | Cloudflare (free plan) | ldavid20@gmail.com | Cloudflare → wrenchandlevel.com |
| Email `luke@wrenchandlevel.com` | iCloud+ Custom Email Domain | Apple Account ldavid20@gmail.com | icloud.com → iCloud+ Features → Custom Email Domain |
| Booking | Cal.com, username `wrenchandlevel` | calendar ldavid20@gmail.com | app.cal.com |

Live site: **https://wrenchandlevel.com**. The old Workers address, `wrenchandlevel.ldavid20.workers.dev`, may be switched off in the Worker's settings; the site doesn't depend on it.

## Code and deploys

- Astro static site. `npm run dev` for local work at http://localhost:4321, `npm run build` to build `dist/`.
- **Every push to `main` deploys.** Cloudflare builds it, usually within a minute or two. `main` is the only branch and the GitHub default.
- Commits use the personal author set in this repo only: `Luke David <ldavid20@gmail.com>`. The global git identity on this Mac is the Gigantic one, so don't commit from a fresh clone without setting it:

  ```sh
  git config user.name "Luke David"
  git config user.email "ldavid20@gmail.com"
  ```

- The `gh` CLI has two GitHub accounts logged in. **DFam8** must be active to push here; switch back after doing Gigantic work:

  ```sh
  gh auth switch --user DFam8
  ```

- The repo was moved from `giganticdesignco/wrenchandlevel` to `DFam8/wrenchandlevel` with GitHub's Transfer ownership. The old URL redirects, but use the new one.

### Where content lives

| What | File |
| --- | --- |
| Prices, add-ons, parts markup, trip fee, job lengths | `src/data/prices.json` |
| Phone, email, towns, insurance, years, photos, reviews | `src/data/site.ts` (leave `null` or empty to keep hidden) |
| Town positions on the About page map | `src/data/map.ts` (one line per town; the build stops if a town is missing) |
| FAQ | `src/data/faq.ts` |
| Booking logic and Cal.com prefill | `src/lib/booking.ts` |
| Photos | `public/photos/`, then set the path in `src/data/site.ts` |

Current content: phone 563-580-7440, email luke@wrenchandlevel.com, towns Asbury, Peosta, Epworth, Sherrill, Farley and East Dubuque, IL. Insurance and years installing are deliberately left off. No photos or reviews yet; the site hides those sections until they're filled in. Real reviews and real claims only.

## Hosting: Cloudflare Worker

The site is a **static-assets Worker**, not a Cloudflare Pages project. Cloudflare's "Create application" flow now makes Workers, and it deploys with `npx wrangler deploy`.

- Config is `wrangler.jsonc` in the repo:
  - `name` must stay `wrenchandlevel`, matching the Worker's name in the dashboard.
  - `assets.directory` is `./dist`.
  - `html_handling: drop-trailing-slash` serves `/about` (Astro builds `about/index.html`).
  - `not_found_handling: 404-page` serves `dist/404.html` with a real 404 status for unknown paths.
- Build settings in the dashboard: build command `npm run build`, deploy command `npx wrangler deploy`, build variable `NODE_VERSION` = `22`.
- Custom domains on the Worker (Worker → Domains): `wrenchandlevel.com` and `www.wrenchandlevel.com`. Cloudflare created their DNS records itself.
- To check the config locally without deploying: `npx wrangler deploy --dry-run`.

## Domain and DNS

- **Registered at GoDaddy, DNS hosted on Cloudflare.** The GoDaddy nameservers were replaced with Cloudflare's:
  - `elliott.ns.cloudflare.com`
  - `jean.ns.cloudflare.com`
- Make all DNS changes in Cloudflare, not GoDaddy. GoDaddy is only where the domain renews.
- When the domain was moved, Cloudflare imported GoDaddy's parking records (two `A` records, a `www` CNAME, a `_domainconnect` CNAME). They were deleted so the Worker could take the names.

### Redirect rules

Cloudflare → wrenchandlevel.com → Rules. Both came from Cloudflare's templates:

1. **Redirect from WWW to root**: `https://www.*` → `https://wrenchandlevel.com/…`, 301, keeps path and query.
2. **Redirect from HTTP to HTTPS**: `http://*` → `https://…`, 301.

Result, checked 2026-09-29: `http://`, `http://www`, `https://www` and `https://` all end at `https://wrenchandlevel.com`, with the path kept.

Gotchas:

- The "Always Use HTTPS" switch wasn't where the docs say in the new dashboard. The HTTP → HTTPS rule template does the same job.
- Deploying the www rule shows "This rule may not apply to your traffic". It's wrong: the `www` record is the Worker's custom domain, which the check doesn't recognize. Choose **Ignore and deploy rule anyway**, and don't let it create a new DNS record.

### Bot settings

Set when the domain was added to Cloudflare. Search crawlers and AI agents were allowed and Bot Preference Sync left on (Cloudflare adds its lines to the top of `robots.txt`). AI training defaulted to allowed; check Cloudflare for the final choice. It isn't recorded here.

## Email: luke@wrenchandlevel.com

Runs on **iCloud+ Custom Email Domain**, on Luke's personal Apple Account (login ldavid20@gmail.com, 2 TB plan). The domain is set to **Only you**, so family members aren't affected. It's a real inbox that sends and receives, not forwarding.

- Read and send in **Mail on the Mac** (the iCloud account; From is `luke@wrenchandlevel.com`), on iPhone, or at icloud.com/mail.
- Add or remove addresses: icloud.com → iCloud+ Features → Custom Email Domain → wrenchandlevel.com.
- **"Allow All Incoming Messages" is off** on purpose. On, it catches mail to any made-up address at the domain, which is mostly spam.
- Tested 2026-09-29: sent from luke@ to Gmail and replied back. Both directions work.

### Mail DNS records (in Cloudflare)

Apple added these through its "Set up automatically with Cloudflare" button:

| Type | Name | Value |
| --- | --- | --- |
| MX | `wrenchandlevel.com` | `mx01.mail.icloud.com` (priority 10) |
| MX | `wrenchandlevel.com` | `mx02.mail.icloud.com` (priority 10) |
| TXT | `wrenchandlevel.com` | `apple-domain=…` (Apple's verification code) |
| TXT | `wrenchandlevel.com` | `v=spf1 include:icloud.com ~all` |
| CNAME | `sig1._domainkey` | `sig1.dkim.wrenchandlevel.com.at.icloudmailadmin.com` |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; adkim=r; aspf=r;` |

`_dmarc` was edited by hand: GoDaddy's original also sent reports to `dmarc_rua@onsecureserver.net` (GoDaddy), which was removed. There's also a leftover `cf2024-1._domainkey` TXT record from Cloudflare Email Routing; it's harmless and can be deleted.

### Don't turn on Cloudflare Email Routing

It was tried first and then disabled. Email Routing only forwards (it has no inbox), and its MX records conflict with Apple's. A domain's mail can only go to one place. If you turn Email Routing on again, iCloud mail stops arriving.

Cloudflare's "Email Service" is a developer product (sending from code, paid Workers plan), not a mailbox either.

### How the email decision was made

- Gmail can't host a custom-domain inbox for free. That's Google Workspace, about $7 a month.
- Cloudflare Email Routing to Gmail is free, but it's forward-only, and replying "as" the domain from free Gmail isn't fully authenticated, so it tends to go to spam.
- iCloud+ was already paid for, works in Mail on the Mac, and signs outgoing mail properly. That's why it won.

## Booking: Cal.com

- Account username `wrenchandlevel`, bookings go to the ldavid20@gmail.com calendar.
- Availability: Mon–Fri 5–9 pm, Sat–Sun 8 am–6 pm, America/Chicago.
- Conflict checking against the ldavid20, Kids, Taresa David and Family calendars.
- 7 event types, one per service. Slugs, lengths and booking-question identifiers must match the table in `README.md` exactly, or prefill breaks. Every event: In Person (Attendee Address), phone required, 30 min buffer after, 1 day minimum notice.
- All booking questions are Short text and optional; the site's Parts step does the checking.
- `/book` runs Service → Parts on the site, then shows the Cal.com embed prefilled with the answers. After booking it sends people to `/booked`.

Gotchas:

- A Cal.com Save sometimes doesn't take. Wait for the "updated successfully" toast, or reload and check.
- Browser automation can't click time slots inside the embed (it's a cross-origin iframe), but real clicks work. To inspect the prefilled form, open the Cal.com link directly with the same query parameters.
- Don't make test bookings on the real calendar without meaning to. Stop at the Confirm button.

## SEO

- `site` in `astro.config.mjs` is `https://wrenchandlevel.com`.
- Every page has a canonical link to its `https://wrenchandlevel.com/...` address (no www, no trailing slash). The code is in `src/layouts/Base.astro`.
- `/sitemap.xml` is generated from `src/pages` by `src/pages/sitemap.xml.ts`, and skips `/booked` and `/404`.
- `/booked` and `/404` are marked `noindex`.
- `public/robots.txt` allows everything and points to the sitemap.
- Not done yet: submit the sitemap in Google Search Console.

## Troubleshooting

- **The domain won't load on this Mac after a DNS change**, but works elsewhere: the Mac cached the old answer. Flush it:

  ```sh
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  ```

- **Is DNS right?** Ask Cloudflare's nameserver directly: `dig +short MX wrenchandlevel.com @elliott.ns.cloudflare.com`. After a nameserver change, check the `.com` registry with `dig NS wrenchandlevel.com @a.gtld-servers.net +norec`.
- **Does iCloud accept mail for an address?** Without sending anything, Apple's server answers `250 Ok` for a real address and `550 user does not exist` for a fake one (SMTP `RCPT TO` against `mx01.mail.icloud.com`).
- **A push didn't deploy:** check the Worker's Deployments tab in Cloudflare for the build log. A Node version error means raising `NODE_VERSION`.
- **Push rejected by GitHub:** `gh auth switch --user DFam8`.

## Still to do

- Photos: hero, TV, hanging, furniture, odd jobs, brakes, about.
- Real customer reviews.
- Submit the sitemap in Google Search Console.
- Optional: delete the leftover `cf2024-1._domainkey` TXT record.
