# PMT Woodland Intermediate landing page

One-page landing page for Meta ad traffic to the Woodland Intermediate class.
Plain HTML, CSS and one small JavaScript file. No build step.

## Files

| File | What it is |
|---|---|
| `index.html` | The page. All copy lives here. |
| `config.js` | **The one file you edit**: checkout links, dates, tracking IDs, phone, on/off switches. |
| `styles.css` | Design and motion. |
| `main.js` | Tracking, dates, accordions, video, copy-address, motion. |
| `assets/` | Photos and logos (WebP for speed, JPG as fallback). |
| `netlify.toml` | Hosting rules: every other path redirects to `/`, caching. |

## Common changes (all in `config.js`)

**Add or change a class date.** Add a line inside `dates`:

```js
dates: [
  { date: "2026-11-21", label: "Saturday, Nov 21, 2026", status: "open" },
  { date: "2026-12-12", label: "Saturday, Dec 12, 2026", status: "open" }
],
```

- `date` is year-month-day. `label` is what visitors read.
- `status`: `"open"`, `"few"` (shows "Few seats left") or `"full"` (shows "Full"). Use `"few"` only when the office confirms seats are low.
- Past dates hide on their own, using California time. A class still shows on the day it runs.
- The gold pill in the hero and the line in the final section show the next date. If that date is marked `"full"` and a later one is open, they show the later one.
- With no upcoming dates, the list reads "New Woodland dates are coming soon. Call (925) 373-4802 and we'll tell you the next one." and the hero pill hides.

**Change a checkout link.** Edit `links.licensing` (NOT LICENSED YET, 1DPC) or `links.licensed` (ALREADY LICENSED, IRC). All three copies of each button update.

**Turn on tracking.** Paste the IDs:

```js
tracking: {
  metaPixelId: "1234567890",
  ga4Id: "G-XXXXXXX"
},
```

Leave either one as `""` to keep it off. The page works with both off.

**Other switches**

| Setting | What it does |
|---|---|
| `passUtmsToCheckout` | `true` adds the visitor's `utm_*` values to the checkout links. Test the checkout page first. |
| `woodlandRating`, `woodlandReviewsShown` | The "5.0 ★ · 120+ Google reviews" numbers in the credibility strip. |
| `showTotalControlLogo` | Keep `false` until PMT has written permission from Total Control Training. When `true`, add the logo as `assets/total-control-logo.png`. |
| `stickyMobileCta` | `true` shows a two-button bar at the bottom of phone screens. Off by default. |
| `motion` | `false` turns off every animation. Visitors with "reduce motion" on their device never see motion. |
| `heroSlideshow` | `false` keeps the hero on the first photo only. |
| `phoneDisplay`, `phoneTel`, `privacyUrl`, `entryTestVideoId` | Phone number, privacy link and the entry test video. |

Changing copy means editing `index.html`. Prices, times and policies are written there, not in `config.js`.

## Checking tracking

Open the page with `?debug=1` on the end (for example `/?utm_source=test&debug=1`) and open the browser console. Every event prints as `[PMT event]` with its parameters, even when the pixel IDs are empty.

| Action | Meta event | GA4 event |
|---|---|---|
| Page load | `PageView`, `ViewContent` | `page_view` (automatic) |
| Checkout button | `InitiateCheckout` | `register_click` |
| Phone tap | `Contact` | `phone_tap` |
| Email tap | `Contact` | `email_tap` |
| Video play | `EntryTestVideoPlay` (custom) | `video_play` |
| Skill opened | none | `skill_open` |
| FAQ opened | none | `faq_open` |
| Copy address | none | `copy_address` |
| Scroll 50% / 90% | none | `scroll_depth` |

Checkout clicks carry `option` (`licensing` / `licensed`), `course` (`1DPC` / `IRC`), `location` (`WLD`), `position` (`top` / `middle` / `bottom`), `value` 425 and `currency` USD. Every event also carries the saved `utm_*` values and `fbclid`.

To test the "no dates" message: `/?debug=1&today=2026-12-01`.

## Meta setup

- **Ad destination URL:** the landing page URL plus
  `utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&utm_id={{campaign.id}}`
- **Events Manager:** create 2 custom conversions from `InitiateCheckout`, one filtered by `option = licensing` and one by `option = licensed`.
- **Purchases:** these still happen on the MSI5 checkout. Match them back from the MSI5 export each cycle.
- **GA4:** leave Enhanced measurement on in the GA4 property settings.

## Photos

- Real PMT range photos only. Never stock or AI-generated.
- To swap a photo, replace the files with the same names in `assets/` (each photo has a `.jpg` plus `-480`, `-720`/`-828`, `-1080`, `-1320` `.webp` sizes).
- The CMSP seal on the page is `cmsp-logo-240`, the supplied `cmsp-logo.png` scaled down with no other change. Don't recolor or filter it or the PMT logo.

## Deploy

Netlify, static site: no build command, publish directory is this folder. Suggested site name `pmt-woodland-intermediate`. If the site name changes, update the two `og:` URLs near the top of `index.html`.

## Open items before launch

1. Meta pixel ID and GA4 ID (or launch without them).
2. Next Woodland Intermediate date(s) after Nov 21.
3. PMT (Chris or Craig) OKs the footer cookie notice.
4. Launch-day recheck: prices ($425, $149), 1,250+ Google reviews, Woodland 5.0 / 120+, and the four quoted reviews still live with the same wording.
5. Releases from recognizable riders in the photos.
6. Optional: written OK from Total Control Training to show its logo.
