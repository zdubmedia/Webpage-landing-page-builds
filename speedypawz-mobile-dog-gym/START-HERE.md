# START HERE: Speedy PawZ booking landing page

For any future Claude session (or person) working on this site. Read this first, then `brand/speedypawz-brand-guide.md` and `brand/speedypawz-visual-design-guide.md`. They are the source of truth for voice, facts, colors and type.

## What this is
A one-page, mobile-first booking page for **Speedy PawZ Mobile Dog Gym** (Woodland, CA), built by ZDub Media. Ads, the Instagram bio link and DMs all send people here. **One goal:** send a session request (or a quick-call request). Plain static site, no build step, hosted on Netlify with Netlify Forms.

## The rules that matter most
- **No escapes.** No nav menu, no social links, no outbound links, no link to speedypawz.com. Every button smooth-scrolls to `#book`. Only exceptions: the privacy page (it has big "Back to Speedy PawZ" buttons), and the `sms:`/`tel:` links in the booking section. The thank-you page may link to Instagram (after conversion).
- **Never invent facts.** No made-up prices, reviews, numbers, hours, credentials, client names or policies. Unknowns live in `site-config.js` as `null` and render honest fallbacks.
- **Brand:** always "Speedy PawZ" (capital Z). Not grooming. No medical claims or guarantees. Never show or describe a dog forced or left alone. No em dashes, no emojis in page copy. Gold text only on navy/black. Red only for buttons.
- **Photos:** real ones only. Never alter faces or real dogs. Small crops (~440 px) never shown wider than ~480 CSS px.

## File map
| Path | What it is |
|---|---|
| `index.html` | The page. All copy lives here, section by section (hero, VSL, how it works, meet Emelyn, who it's for, safety, proof, pricing, FAQ, booking, final CTA, footer). |
| `site-config.js` | **The one file to edit for facts and switches.** Prices, promo, services, time windows, service days, FAQ answers, response time, VSL, calendar embed, van frames, pixel. |
| `thank-you.html` | After a request. Shows the first name from `?name=`. vCard download, Instagram link, fires Meta `Lead` if the pixel is on. `noindex`. |
| `privacy.html` | Plain-English privacy policy. [CONFIRM legal review] |
| `css/site.css` | All styles. Tokens at the top match the visual design guide. |
| `js/main.js` | Config rendering, review mode, dog illustrations, race-track progress, sticky CTA, flip cards, counters, pace dial, PawZ Reel, easter egg, pixel. |
| `js/booking.js` | Tabs, 3-step session form, quick-call form, validation, Netlify AJAX submit. |
| `js/scene.js` | The pinned, scroll-scrubbed van scene (GSAP ScrollTrigger) and the frame-sequence upgrade. |
| `vendor/` | GSAP 3.13 + ScrollTrigger, self-hosted (free "no charge" license). |
| `assets/fonts/` | Self-hosted Poppins, Nunito, Racing Sans One (latin subsets). |
| `assets/photos/` | Photos plus WebP/AVIF versions. See `assets/photos/README.md` for every slot. |
| `assets/logo/`, `assets/icons/` | Badge logo sizes, favicons, apple-touch-icon. |
| `assets/og-image.jpg` | 1200x630 share image. |
| `assets/speedypawz.vcf` | "Save our number" contact card. |
| `assets/video/` | Drop the intro video here (see below). |
| `assets/van-sequence/` | Optional photo-realistic frames for the van scene (see its README). |
| `brand/` | Brand guide, visual design guide, original build brief. Redirected away on the live site. |
| `netlify.toml` | Publish settings, redirects, caching headers. |
| `FOR-EMELYN.md` | One-page owner note. |

## How to edit
- **Copy:** edit `index.html` directly. Keep sentence case, one gold highlight (`<span class="hl">`) per headline, no em dashes.
- **Facts and switches:** edit `site-config.js`. `null` = not confirmed, page shows a fallback.
  - `prices.firstSession` / `prices.weekly`: e.g. `"$45"`. When both are set, the "Emelyn will text you pricing" line hides.
  - `promo`: set `active: true`, `details` and a real `endDate` (`"2026-11-30"`). It hides itself after the end date (California time).
  - `responseTimePromise`: a phrase like `"within 30 minutes during business hours"`. It appears in the booking intro, FAQ and thank-you page.
  - `travelRadius`, `notReadyPolicy`: full sentences, e.g. `"We travel up to 25 miles from Woodland."`
  - `faq.*`: answers for the five unconfirmed FAQ questions.
  - `services`, `timeWindows` (add `hint: "8 to 11 am"`), `serviceDays` (`[1,2,3,4,5,6]`), `bookingWindowDays`.
  - `freeMeetAndGreet: true` renames the call tab to "Free meet-and-greet".
- **Review mode:** open `/?review=1`. Every unconfirmed item gets a gold "CONFIRM" note and a floating list with jump links. `/?review=0` turns it off. Use this to walk Emelyn through the page.

## Add the VSL (intro video)
1. Put the file at `assets/video/intro.mp4` (H.264, under ~15 MB; optional captions `assets/video/intro.vtt`).
2. In `site-config.js`: `vsl: { src: "assets/video/intro.mp4", captions: "assets/video/intro.vtt", poster: "..." }`.
The "See Speedy PawZ in action" section appears below the hero. It autoplays muted while on screen, with a big "Tap to watch with sound" button. Portrait or landscape is detected automatically.

## Add a booking calendar
Set `calendarEmbed: { type: "iframe", src: "https://...", height: 760, name: "Square Appointments" }`. The "Request a session" tab then shows the live calendar first and the request form under "Can't find a time?". **Set the calendar's own "after booking" redirect to `/thank-you.html`.** [CONFIRM which platform Emelyn uses]

## Add the photo-realistic van scene
See `assets/van-sequence/README.md`. Drop frames `0001.webp...`, set `vanSequence.frameCount`. The SVG scene is replaced, beats stay.

## Turn on the Meta pixel
1. Set `metaPixelId` in `site-config.js`. PageView fires on every page, `Lead` on the thank-you page, and a custom `CTAClick` on CTA taps.
2. **Before going live with the pixel, add a cookie notice to the footer** (Meta's terms require telling visitors), and update `privacy.html` to mention Meta cookies.

## Forms (Netlify Forms)
- Two forms: `session-request` and `call-request`. They are real HTML forms in `index.html` with `data-netlify="true"` and a honeypot, so Netlify detects every field at deploy.
- Multi-select chips are joined by JS into hidden fields `dog_is` and `services`. Hidden fields: `subject` (sets the notification email subject, `data-remove-prefix`), `source` (UTMs or fbclid, kept for the session), `page_variant`.
- Submission is AJAX (`fetch('/')`), then a checkered-flag wipe and a redirect to `thank-you.html?name=First` (`&type=call` for calls).
- Notification emails: Netlify > Site > Forms > Form notifications > Email, to info@speedypawz.com and Zach. Subject comes from the hidden `subject` field: `New Speedy PawZ request: {dog} ({city})`. **Ask Zach before turning these on.**

## Deploy
Only after Zach says "deploy".
1. Netlify connector or `npx netlify-cli`. List existing sites first. **Never touch the ZDub Media site.**
2. Create a new site `speedypawz` (or `speedypawz-mobile-dog-gym`), publish directory = this folder (`netlify.toml` has `publish = "."`).
3. Check both forms appear under Forms. Send one test of each from a phone-sized viewport, confirm they land and the thank-you page shows the name, then delete the test submissions.
4. After the first deploy, change the `og:image` meta and JSON-LD `image`/`logo` in `index.html` to absolute URLs on the live domain (Facebook needs absolute URLs for previews).
5. **Do not touch DNS or speedypawz.com.** `book.speedypawz.com` is a later step that needs Emelyn's OK.

## Local preview
Any static server from this folder, e.g. `python3 -m http.server 8000`. Form POSTs only work on Netlify (locally the submit shows the friendly error unless your server accepts POST to `/`).

## Open [CONFIRM] items
1. Story wording in "Meet your coach" (Emelyn to approve)
2. OK to show Adan (flip card 2); "One-on-one with your pup, every session" line
3. Which husky is in `husky-bandana-mill.jpg` (Kira or Kiko?)
4. Older dog photo for "Who it's for"
5. Real Google review quotes with names and permission
6. Prices: first session, weekly regulars
7. Black Friday details and end date
8. What happens if a dog isn't ready that day
9. Travel radius
10. Response time promise
11. FAQ: cost, do owners need to be home, size/breed/age limits, vaccine/intake requirements, meet-and-greet
12. Final services list (two dogs same home, meet-and-greet)
13. Real service days and hours (time windows)
14. Booking platform for the calendar embed
15. Is the meet-and-greet free?
16. Intro video
17. Owner permission for every client dog photo
18. Privacy policy legal review
