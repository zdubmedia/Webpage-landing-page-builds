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
| `index.html` | The page. All copy lives here, section by section: hero, VSL, how it works, meet Emelyn (story, flip cards, trust list, real review quotes, community), who it's for (four dog types, walk comparison, "your dog sets the pace" dial), booking (Black Friday packs, FAQ button, form), FAQ (with a "still have a question" box), zoomies band, final CTA, footer. |
| `site-config.js` | **The one file to edit for facts and switches.** Prices, promo, services, time windows, service days, FAQ answers, response time, VSL, calendar embed, pixel. |
| `thank-you.html` | After a request. Shows the first name from `?name=`. vCard download, Instagram link, fires Meta `Lead` if the pixel is on. `noindex`. |
| `privacy.html` | Plain-English privacy policy. [CONFIRM legal review] |
| `css/site.css` | All styles. Tokens at the top match the visual design guide. |
| `js/main.js` | Config rendering, review mode, dog illustrations, race-track progress, sticky CTA, flip cards, pace dial, VSL, pack buttons, Black Friday switch, easter egg, pixel. |
| `js/booking.js` | Tabs, 3-step session form, quick-call form, validation, Netlify AJAX submit. |
| `js/intro.js` | The lick opener: gold screen with the logo, the pup hops out of the van and runs up, one big lick, then red, navy and gold curves follow the tongue up the screen and reveal the hero. |
| `js/flow.js` | The flow layer: wavy ribbon marquees, section arcs that flatten as they rise, the giant "zoomies / snoozies" type band. Decoration only. |
| `js/scene.js` | Every short film on the page: the five "How it works" laps and the clips in the "Who it's for" cards. Each one starts by itself once it has scrolled onto the screen. |
| `vendor/` | GSAP 3.13 + ScrollTrigger, self-hosted (free "no charge" license). |
| `assets/fonts/` | Self-hosted Poppins, Nunito, Racing Sans One (latin subsets). |
| `assets/photos/` | Photos plus WebP/AVIF versions. See `assets/photos/README.md` for every slot. |
| `assets/logo/`, `assets/icons/` | Badge logo sizes, favicons, apple-touch-icon. |
| `assets/og-image.jpg` | 1200x630 share image. |
| `assets/speedypawz.vcf` | "Save our number" contact card. |
| `assets/video/` | Drop the intro video here (see below). |
| `assets/intro/` | The lick opener clip, two sizes (`lick-720.mp4` phones, `lick-1080.mp4` desktop). |
| `assets/scene/` | The five lap films: videos in `film/`, and the same films as still frames in `seq/` for phones that refuse to autoplay video. See its README to swap in new clips. |
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

## The VSL (intro video under the hero)
- **What's there now:** a 93-second placeholder cut from Emelyn's own reels (screen recordings Zach saved), following the VSL script v1.1: hook ("I asked if she was ready for the dog gym..."), "Hi! I'm Emelyn", why she started (Kira and Kiko), the van at your curb, coaching and no motor, "Will my dog actually get on it?" in her own voice, Kymber's nap, who it's for, and an end card that points at the button under the video.
- Her real voice is used only where a clip has it (the hook, the 14-second "slat mills are a tool" selfie, "Come on, Kymber!"). Everything else is on-screen text. Nothing is AI voice.
- **Music:** a simple original track generated by the build script, so there is nothing to license. Swap in a licensed track for ads if you want something better.
- **Files:** `assets/video/intro-720.mp4` (what the page plays, 7.5 MB), `intro.mp4` (1080x1920 master for ads, 18 MB), `intro-poster.jpg`, `intro.vtt` (captions).
- **On the page:** plays muted on its own when it scrolls into view (the text cards carry it without sound), with a red "Tap for sound" button that restarts it from the top with sound. If the phone refuses to autoplay (Low Power Mode) it shows the poster and a play button.
- **Rebuilding it:** `tools/build_vsl.py`. The edit list (`EDL`) at the top says which clip, which seconds, which crop and which text card. Put the source clips in `$SPZ_WORK/drive/` and run `SPZ_WORK=/path python3 tools/build_vsl.py`. Needs ffmpeg, numpy and Pillow.
- **Next version:** when Emelyn records the "EMELYN SAYS" lines from the script, replace the text-card segments with her selfie takes. Use new file names (`intro2-720.mp4`) and update `vsl` in `site-config.js`, because `/assets` is cached for a year.
- Clip A from the script (her husky with Adan) was not in the Drive folder, so the origin beat uses the huskies photo and her husky ad clip instead.

## Black Friday packs (auto switch-off)
- Prices are from her Nov 2026 post: Kickstart 2 sessions from $99 ($130 value), Foundation 4 sessions from $179 ($260 value, most popular), Ultimate PawZ 8 sessions from $329 ($520 value, best value, can be shared between dogs in one household). Pay now, schedule later.
- Everything sale-related carries `data-sale-until="2026-11-30"` in `index.html` (hero chip, the pack cards, the FAQ cost answer). After that day (California time) it disappears by itself and the regular pricing block (`data-after-sale`) comes back. The three packs also drop out of the booking form's options after Nov 30 (`until` in `site-config.js` services).
- Each "Claim ..." button scrolls to the form and ticks that pack in step 2, so the request email says which pack.
- To extend the sale, change the date in those places. To run a new sale, copy the `.sale` block.
- Each pack shows the regular price crossed out (Reg. $130 / $260 / $520) next to the sale price, so visitors know prices go back up after Nov 30. Fine print from her post: 30-minute sessions, per dog.

## Page order (Zach, Nov 21)
Trust builds in one run, then fit, then the ask:
1. Hero, VSL, how it works.
2. Meet Emelyn: one-line story, flip cards, "Why you can trust me with your pup", "What pup parents are saying" (real review quotes), "Part of the pack" (community).
3. Who it's for: four dog types, "Why not just a walk?", then "Your dog sets the pace. Always." with the dial (id `safety`, so old links still land).
4. Booking: heading, the Black Friday packs (id `pricing`; after Nov 30 the regular pricing note shows instead), a "Have a question first? See the FAQs" button that scrolls down, then the form.
5. FAQ, ending with a "Still have a question?" box: call, text and email buttons, and a plain-text mention of the Instagram handle (not a link, so the page still has no outbound links).
6. Zoomies band, final CTA, footer.
Note: the original brief kept call and text links inside the booking section only. Zach asked for them under the FAQ too (Nov 21), so they are there now.
Reviews (as of Nov 21, all that exist so far): Leticia L.'s public Facebook review (two German Shepherds, ages 5 and 11) and Brianne's note after Kymber's session, shared on social; Kymber went on to weekly sessions. Quotes are trimmed lightly (emojis and repeated "!!!" removed, the misspelled business name left out). Add new reviews as `<figure class="quote">` blocks in `index.html`. Ask Brianne before the page goes live; review mode flags it.

## Feedback round (Jackie and Yana, Nov 20)
Their log is the "Speedy PawZ Landing Page: Feedback & Change Log" doc. What changed on the page:
- C1/C2 too long and repetitive: "no motor / your dog sets the pace" now appears once in full (Pit stop) plus the dial; Emelyn's story is one paragraph (the video tells the rest); safety list merged into the trust list; two FAQ items that repeated the page were cut; flip cards and community items sit two across on phones. The page is about 6% shorter than before even with the video and the packs added.
- C3 key info up top: hero chips now say 30 minutes one-on-one, no motor, we come to you rain or shine; the Black Friday deal is in the hero.
- C4 trust: "Why you can trust me with your pup" list under the flip cards. Her credentials (first aid/CPR, insurance, years) go in `credentials` in `site-config.js` once she confirms them; review mode flags it.
- C5 crammed van / C6 coaching: covered in the video (two huskies side by side, "right by her side", toys and treats).
- C7 dog walker: "Why not just a walk?" comparison in Who it's for, framed as best together.
- C8 water: in the trust list and a new FAQ, flagged until Emelyn confirms.
- C9-C11 video of Emelyn: the VSL above (placeholder until she records).
- C12/C13 tone and hook: new headline "A good run for a happier pup, right at your curb"; "care team" line in her story.
- C14 dogs who love to run: new first card in Who it's for (the cattle dog photo).
- C15 cuter hero dog: not changed. Needs a real photo of a small breed from Emelyn.
- C16 won't get on: Lap 2 copy, the FAQ answer (in her own words) and the video segment.

## Design language (after the sweet-tape.com reference)
Zach's reference for the feel is sweet-tape.com: one flat color fills the whole screen, the next color arrives as a big curve, giant type, ribbons of scrolling text, objects that sit directly on the color.
- **Color fields:** every section is one flat field. Classes: `sec--dark` (midnight), `sec--gold` (PawZ gold), `sec--cream`. Order today: hero (midnight photo), VSL (midnight), how it works (gold laps), meet Emelyn with trust, reviews and community (midnight), who it's for with the walk comparison and pace dial (cream), booking with the packs (midnight), FAQ (cream), zoomies band (gold), final CTA (gold), footer (black).
- **Arcs:** each section starts with `<div class="arc">`, a dome in the section's own color that overlaps the section above. `js/flow.js` flattens it as it scrolls into view.
- **Ribbons:** `<div class="ribbon" data-phrase="...">` at the top of a section draws a wavy band of scrolling text across the boundary. Two today (red after the hero, navy at the top of who it's for). Only signature phrases, in normal case so "PawZ" keeps its capital Z.
- **Giant band:** `.giant` before booking. Decorative (`aria-hidden`); the final CTA carries the same words for screen readers.
- **Highlights:** gold text on midnight; on gold fields the highlight is a small navy box with gold text (an inline PawZ Box); on cream it is a gold marker stroke. Gold text never sits on a light color.
- **Red:** still buttons only, plus the one red ribbon. Her brand guide reserves red for the call to action, so there are no red sections. If Zach wants a red field, that is a brand-rule change to clear with Emelyn.

## The lick opener
- Sequence: gold screen, logo pops, the pup hops out of the van and runs up until his nose is on the lens, one big lick with the tongue sweeping up from the bottom, then red, navy and gold curves follow the tongue up the screen and roll away to reveal the hero. About 4.5 seconds.
- The clip is two clips joined: the first run-up clip, cut on the black frame where the nose fills the lens, into Zach's lick clip. The join is hidden by that black frame.
- Plays on **every fresh page load**. It does not replay when someone comes back with the Back button, never plays with reduced motion, and can be skipped (button or Escape).
- **Switch:** `data-intro` on the `<html>` tag in `index.html`: `"on"` (every load), `"once"` (one time per visit, a sensible setting once real ad traffic is running), `"off"`. `/?intro=0` skips it once, `/?intro=1` forces it.
- **Low Power Mode:** an iPhone in Low Power Mode refuses to start any video by itself. The opener asks the browser first; if the answer is no, it plays the same clip from still frames (`assets/intro/seq2/`, 38 frames) so the pup still shows up.
- **Files:** `assets/intro/lick2-720.mp4` (phones), `lick2-1080.mp4` (desktop), `seq2/` (frame copy).
- **Replace the clip:** make one upright clip about 2.5 seconds long that ends on the lick, encode it as above sizes, then rebuild the frames: `ffmpeg -i assets/intro/lick3-720.mp4 -vf "fps=15,scale=540:680" -start_number 0 -c:v libwebp -quality 48 assets/intro/seq3/%03d.webp`. Use new file names (browsers cache `/assets` for a year), then at the top of `js/intro.js` set the file names, the frame count (`SEQ.n`), `BOOP_AT` (seconds in: nose bumps the lens) and `LICK_AT` (seconds in: tongue comes up, the curves start).
- With the opener on, the hero skips its own start-lights and logo roll-in. With it off, the original hero start sequence plays.

## Add a booking calendar
Set `calendarEmbed: { type: "iframe", src: "https://...", height: 760, name: "Square Appointments" }`. The "Request a session" tab then shows the live calendar first and the request form under "Can't find a time?". **Set the calendar's own "after booking" redirect to `/thank-you.html`.** [CONFIRM which platform Emelyn uses]

## "How it works" laps
- **Layout:** five laps sit one under the other (Lap 1, Lap 2, Lap 3, Pit stop, Finish line), each a color band with its step card and a picture under it. Plain vertical scroll, nothing sticks, no dots or buttons.
- **How the films play:** when a lap's picture has scrolled far enough onto the screen (a bit more than half of it showing, so the step card above it is in view), its film starts by itself and plays through, even if you stop scrolling. Lap 1 (van) and the Finish line (nap) play once and rest on their last frame. Lap 2, Lap 3 and the Pit stop loop. A film pauses when it leaves the screen and starts over the next time it comes back.
- **To change once/loop:** `data-play="once"` or `"loop"` on that lap's `<div class="lap__media">` in `index.html`. `data-hold` is the pause in milliseconds before a loop starts over.
- **To change when a film starts:** the `0.55` in `js/scene.js` (how much of the picture must be showing).
- **No play buttons, ever.** Films are videos where the browser allows them to start on their own. Where it refuses (iPhone Low Power Mode), the same films play from still frames on a canvas, a little less smooth but automatic.
- Reduced motion or no JavaScript: each lap shows one still picture.
- See `assets/scene/README.md` for what each lap uses, how to swap in a clip, and the Kling prompts that worked.

Still wanted:
1. **A treadmill shot with more cartoonish energy** (Zach is working on it). Replaces `3-trot`.
2. **A push-in that ends on her real slat mills.** The current one is cut at the doorway because Kling drew motorized treadmills inside.
3. **Lick opener and Lap 2 clip without the Kling watermark and the Instagram caption text.** Both are cropped out of frame today. A clean export (no watermark, source photo without captions) would let the films show the whole frame.

Session network note: generating from a cloud session needs `kling.ai`, `s15-kling.klingai.com` and `v15-kling.klingai.com` on the environment's allowed hosts (the "Landing pages (Kling access)" environment has them, plus `sweet-tape.com` for the reference site).

## Photos and clips changed after Zach's phone reviews
- **Meet your coach, first card:** `emelyn-and-pup-van` (her whole head in frame). It is a crop of an Instagram frame, so it is small (477 px wide). A full-size original from Emelyn would be sharper.
- **"The pups who started it all":** `huskies-on-the-mills`, both huskies in frame. The source was Emelyn's Instagram story, with the caption text and arrows cleaned off by an AI edit; nothing else was changed. Zach has since sent a clean photo of both huskies sitting on the mills (wide, not upright); it does not fit this upright card without cutting a dog off, so it is not placed yet.
- **"Who it's for" cards are short clips now.** Each plays once when the card comes on screen, then rests on its last frame (which is also the still that shows before it plays). Files: `assets/video/<name>.mp4`, the still `assets/photos/<name>.jpg`, and a frame copy in `assets/video/seq/<name>/` for phones that will not autoplay.
  - High-energy pups: `excited-pup-leash` (German Shepherd bouncing on a leash).
  - Older dogs: `older-dog-rest` (dog settles down on the carpet). Setting `olderDogPhoto` in `site-config.js` swaps in a real photo.
  - Shy pups: `shy-pup-peek` (puppy peeks out from behind Emelyn in the van).
  - **All three are AI footage, not Emelyn's clients, and the shy pup clip shows an AI Emelyn.** Review mode flags each one. Real clips from her would be better.
  - Not placed now: `heeler-and-emelyn-mill` (the cattle dog photo) and `emelyn-overalls-on-mill`.
- **Pace dial:** under the dial is Zach's pace clip, cut into three loops in `assets/dial/`: the walk for Sniff and stroll, the close-up of the feet for Happy trot, the sprint for Full zoomies. Moving the needle switches loops. The loop frame ranges are the `LOOPS` list in the pace dial part of `js/main.js`. The little drawing remains as the fallback. **This is AI footage too**, and it shows a dog alone on a treadmill with a smooth belt rather than her slat mill; review mode flags it.
- **The PawZ Reel** photo carousel and the four stat boxes are gone (Zach: repetitive). The review quotes and the community block now sit under the trust list in Meet Emelyn, as proof and credibility.
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
5. Reviews: two real quotes are live (Leticia, Brianne). Brianne's OK to quote her; add Google reviews as they come in
6. Prices: first session, weekly regulars
7. Black Friday: done (packs from her post, auto switch-off after Nov 30)
8. What happens if a dog isn't ready that day
9. Travel radius
10. Response time promise
11. FAQ: cost, do owners need to be home, size/breed/age limits, vaccine/intake requirements, meet-and-greet
12. Final services list (two dogs same home, meet-and-greet)
13. Real service days and hours (time windows)
14. Booking platform for the calendar embed
15. Is the meet-and-greet free?
16. Intro video: placeholder is live; Emelyn to record the script lines
17. Owner permission for every client dog photo
19. Emelyn's OK on the AI footage (the opener shows an AI version of her in the background, and every clip shows an AI dog modeled on a client's dog), and a watermark-free export of the opener clip
20. Original photo/video files for the six crops taken from Instagram screenshots
18. Privacy policy legal review
21. Credentials for the trust list (pet first aid or CPR, insurance, training, years with dogs)
22. Water routine (before, during or after)
24. Permission to show Lucy, Delilah and Kymber in the video
25. Is the 25% off first session offer from her reels still running? It is left out of the page and the video for now, since the Black Friday packs can't be combined with other discounts
