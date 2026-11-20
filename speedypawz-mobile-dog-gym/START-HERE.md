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
| `site-config.js` | **The one file to edit for facts and switches.** Prices, promo, services, time windows, service days, FAQ answers, response time, VSL, calendar embed, pixel. |
| `thank-you.html` | After a request. Shows the first name from `?name=`. vCard download, Instagram link, fires Meta `Lead` if the pixel is on. `noindex`. |
| `privacy.html` | Plain-English privacy policy. [CONFIRM legal review] |
| `css/site.css` | All styles. Tokens at the top match the visual design guide. |
| `js/main.js` | Config rendering, review mode, dog illustrations, race-track progress, sticky CTA, flip cards, counters, pace dial, PawZ Reel, easter egg, pixel. |
| `js/booking.js` | Tabs, 3-step session form, quick-call form, validation, Netlify AJAX submit. |
| `js/intro.js` | The lick opener: gold screen with the logo, the pup runs up, boops and licks the lens, his nose fills the screen, blackout, then navy, red and gold curves roll up to reveal the hero. |
| `js/flow.js` | The flow layer: wavy ribbon marquees, section arcs that flatten as they rise, the giant "zoomies / snoozies" type band. Decoration only. |
| `js/scene.js` | The "How it works" scene. It sticks to the screen while you scroll through five steps; arriving at a step plays that step's short film through by itself. |
| `vendor/` | GSAP 3.13 + ScrollTrigger, self-hosted (free "no charge" license). |
| `assets/fonts/` | Self-hosted Poppins, Nunito, Racing Sans One (latin subsets). |
| `assets/photos/` | Photos plus WebP/AVIF versions. See `assets/photos/README.md` for every slot. |
| `assets/logo/`, `assets/icons/` | Badge logo sizes, favicons, apple-touch-icon. |
| `assets/og-image.jpg` | 1200x630 share image. |
| `assets/speedypawz.vcf` | "Save our number" contact card. |
| `assets/video/` | Drop the intro video here (see below). |
| `assets/intro/` | The lick opener clip, two sizes (`lick-720.mp4` phones, `lick-1080.mp4` desktop). |
| `assets/scene/` | The five scene films: videos in `film/`, and the same films as still frames in `seq/` for phones that refuse to autoplay video. See its README to swap in new clips. |
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

## Design language (after the sweet-tape.com reference)
Zach's reference for the feel is sweet-tape.com: one flat color fills the whole screen, the next color arrives as a big curve, giant type, ribbons of scrolling text, objects that sit directly on the color.
- **Color fields:** every section is one flat field. Classes: `sec--dark` (midnight), `sec--gold` (PawZ gold), `sec--cream`. Order today: hero (midnight photo), how it works (gold), meet Emelyn (midnight), who it's for (cream), safety (midnight), proof (gold), pricing (midnight), FAQ (cream), giant band (gold), booking (midnight), final CTA (gold), footer (black).
- **Arcs:** each section starts with `<div class="arc">`, a dome in the section's own color that overlaps the section above. `js/flow.js` flattens it as it scrolls into view.
- **Ribbons:** `<div class="ribbon" data-phrase="...">` at the top of a section draws a wavy band of scrolling text across the boundary. Two today (red after the hero, navy before proof). Only signature phrases, in normal case so "PawZ" keeps its capital Z.
- **Giant band:** `.giant` before booking. Decorative (`aria-hidden`); the final CTA carries the same words for screen readers.
- **Highlights:** gold text on midnight; on gold fields the highlight is a small navy box with gold text (an inline PawZ Box); on cream it is a gold marker stroke. Gold text never sits on a light color.
- **Red:** still buttons only, plus the one red ribbon. Her brand guide reserves red for the call to action, so there are no red sections. If Zach wants a red field, that is a brand-rule change to clear with Emelyn.

## The lick opener
- Sequence: gold screen, logo pops, the clip (pup hops out, runs up, boops the lens, licks), his nose fills the screen, blackout, then navy, red and gold curves roll up and away to reveal the hero. About 4.5 seconds.
- Plays on **every fresh page load** (Zach wants to see it each time while we pitch). It does not replay when someone comes back with the Back button, never plays with reduced motion, and can be skipped (button or Escape).
- **Switch:** `data-intro` on the `<html>` tag in `index.html`: `"on"` (every load), `"once"` (one time per visit, a sensible setting once real ad traffic is running), `"off"`. `/?intro=0` skips it once, `/?intro=1` forces it.
- **Low Power Mode:** an iPhone in Low Power Mode refuses to start any video by itself. The opener asks the browser first; if the answer is no, it plays the same clip from still frames (`assets/intro/seq/`, 39 frames) so the pup still shows up. The scene below does the same.
- **Replace the clip:** export from Kling without the watermark, upright (3:4 or 9:16), ending with the nose filling the frame. Then:
  `ffmpeg -ss START -i clip.mp4 -an -vf "scale=720:-2,setpts=PTS/1.2" -r 24 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart assets/intro/lick-720.mp4` (and again at 1080 wide, crf 28). Keep it about 2.5 seconds. Then rebuild the frames: `ffmpeg -i assets/intro/lick-720.mp4 -vf "fps=15,scale=540:680" -start_number 0 -c:v libwebp -quality 48 assets/intro/seq/%03d.webp` and set the frame count (`SEQ.n`) at the top of `js/intro.js`. The blackout fires 0.1 s before the clip ends and the screen shake 0.95 s before the end (the first nose boop).
- With the opener on, the hero skips its own start-lights and logo roll-in. With it off, the original hero start sequence plays.

## Add a booking calendar
Set `calendarEmbed: { type: "iframe", src: "https://...", height: 760, name: "Square Appointments" }`. The "Request a session" tab then shows the live calendar first and the request form under "Can't find a time?". **Set the calendar's own "after booking" redirect to `/thank-you.html`.** [CONFIRM which platform Emelyn uses]

## "How it works" scene
- **How it moves:** the scene sticks to the screen while you scroll through five steps. Arriving at a step plays that step's film all the way through by itself (the van starts pulling up just before the scene locks in place). Scroll on and the next step plays. When a film ends, a small "Keep scrolling" nudge appears so nobody sits waiting. The dots show where you are; tap one to jump.
- **Why it is smooth now:** the sticking is plain CSS (`position: sticky`), so scrolling stays native, and the films play at their own speed instead of being dragged frame by frame with the thumb.
- **Step length:** each step is 84% of a screen of scrolling. To change it, edit `84svh` in the `.scene-on .scene` rule in `css/site.css`.
- **No play buttons, ever.** Films are videos where the browser allows them. Where it refuses to start videos on its own (iPhone Low Power Mode), the same films play from still frames on a canvas (`assets/scene/seq/`), a little less smooth but automatic.
- Reduced motion: no films, the real van photo and the five step cards show instead.
- See `assets/scene/README.md` for what each step uses, the "seamless" idea (film on a flat color that matches the page, so the van is on the page and not in a video box), how to swap in a clip, and the Kling prompts that worked.

Still wanted:
1. **A treadmill shot with more cartoonish energy** (Zach is working on it). Replaces `3-trot`.
2. **A push-in that ends on her real slat mills.** The current one is cut at the doorway because Kling drew motorized treadmills inside.
3. **Lick opener and Lap 2 clip without the Kling watermark and the Instagram caption text.** Both are cropped out of frame today. A clean export (no watermark, source photo without captions) would let the films show the whole frame.

Session network note: generating from a cloud session needs `kling.ai`, `s15-kling.klingai.com` and `v15-kling.klingai.com` on the environment's allowed hosts (the "Landing pages (Kling access)" environment has them, plus `sweet-tape.com` for the reference site).

## Photos changed after Zach's phone review
- **Meet your coach, first card:** now `emelyn-and-pup-van` (her whole head in frame). It is a crop of an Instagram frame, so it is small (477 px wide). A full-size original from Emelyn would be sharper.
- **"The pups who started it all":** now `huskies-on-the-mills`, both huskies in frame. The only source with both dogs was Emelyn's Instagram story, which had caption text and arrows over it. Those were cleaned off with an AI edit; nothing else was changed. Swap in her original photo when she sends it (review mode flags this).
- **High-energy pups card:** the photo now sits at the top of its frame so the dog's whole face shows. The file itself is cropped right at the top of the head; a wider original would fix that fully.
- **Note on swapping photos:** files in `/assets` are cached by browsers for a year. Give a replacement photo a new file name (and update `index.html`) instead of overwriting the old one.

## The "Powered by Netlify" badge
The preview lives at https://speedypawz.netlify.app (Netlify site `speedypawz`, ZDub Media team, free plan). On the free plan Netlify adds its own "Powered by Netlify" pill to the bottom-right corner of every page, and tapping it opens a card that links to Netlify. We did not add it and the page cannot turn it off; it goes away on a paid Netlify plan. It breaks the "no escapes" rule, so sort this out before real ad traffic goes to the page. Until then, `js/main.js` spots the badge and the `.host-badge` rules in `css/site.css` move the sticky button and the Skip button out from under it.

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
19. Emelyn's OK on the AI footage (the opener shows an AI version of her in the background, and every clip shows an AI dog modeled on a client's dog), and a watermark-free export of the opener clip
20. Original photo/video files for the six crops taken from Instagram screenshots
18. Privacy policy legal review
