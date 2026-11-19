# Speedy PawZ Mobile Dog Gym: Visual Design Guide

**Version 1.0 · November 19, 2026 · Prepared by ZDub Media**
Companion file: `speedypawz-brand-guide.md` (story, voice, messaging).

> **Design idea in one line: "Race-day fun, neighbor-friendly."** Golden badge, racing red, checkered flags and a midnight-navy text box, wrapped around real photos of Emelyn and real dogs. The racing theme is a playful accent, never clutter.
>
> **Where these specs come from.** Every hex code below was sampled from Emelyn's own assets: her logo (profile photo on IG and FB), her reel text overlays, and her TikTok end card. We're not inventing a new look. We're tightening the one she already built so it's identical everywhere.

---

## 1. The look she already has (what we're keeping)

From her IG grid, FB page and TikTok:
- **Round golden-yellow badge logo** with a red ring, "SPEEDY PAWZ" arched in white, three huskies in the center, checkered flags on both sides, paw prints, and "MOBILE DOG GYM" on the bottom of the yellow field.
- **Midnight-navy rounded text box** with bold white rounded type and **one key phrase in gold** ("went full **Mystery Machine**," "We took **2nd place!**," "Velma, **reporting for duty**").
- **End card:** midnight-navy background, centered logo (badge without the yellow field), "Woodland's mobile dog gym" in white, "We come to you" in gold, a **red pill button** reading "speedypawz.com," and "Happy PawZ, Healthy Strides!" in light gray.
- **Location stamps:** red map pin + gold chunky text with dark outline ("Woodland CA"), or white condensed caps + script ("YOLO COUNTY *California*").
- **Signature wardrobe:** red-and-black checkered overalls, red tops, checkered scarf.
- **Signature equipment:** two slat mills with **bright red frames** inside a dark van; branded red/black harness.
- **Event booth:** black-and-white checkered floor tiles.

**What's inconsistent today (we'll standardize):** overlay boxes switch between navy, black and yellow; at least four different display fonts; text outlines on some posts and not others. Section 6 sets one system.

---

## 2. Logo

### Versions
| Version | Description | Use on |
|---|---|---|
| **A. Full badge (primary, main logo)** | Badge inside the golden-yellow circle (same art as the van decal and IG/FB profile photo). File: `speedypawz-logo-badge-primary.png` | Default everywhere: website, ads, profile photos, favicon, merch. Works on navy, cream and photos |
| **B. Badge only (knockout)** | Red ring + huskies + flags, no yellow field. In her own file the flags and "MOBILE DOG GYM" are Logo Navy `#2A1541`. File: `speedypawz-logo-knockout-navy.png` | Light backgrounds only (cream, white). On dark backgrounds use A, or the white-tagline variant `speedypawz-logo-knockout-white-text.png` |
| **C. Wordmark** [to build] | "Speedy PawZ" set in brand type with a small checkered flag | Website nav, email header, tight horizontal spaces |
| **D. Icon** [to build] | Husky head inside red ring | Watermark, small social icons, loading spinner |

### Rules
- **Clear space:** keep space around the badge equal to the height of one husky ear (roughly 10% of badge diameter) on all sides.
- **Minimum size:** 120 px wide on screen (badge text stops reading below this). Use the Icon (D) under 120 px.
- **Watermark on reels/statics:** Version B, 140–180 px on a 1080 px-wide canvas, top-left or bottom-left inside safe zones, 100% opacity (no faded watermarks).
- **Never:** stretch, recolor, rotate, add drop-shadows or glows, place the full yellow badge on a gold background, crop the ring, or redraw the huskies.
- **Files needed:** original vector (SVG/AI/EPS) or a 3000 px transparent PNG. [CONFIRM: ask Emelyn or her original designer]

---

## 3. Color palette

### Core colors (sampled from her assets)
| Swatch | Name | HEX | RGB | Sampled from | Role |
|---|---|---|---|---|---|
| 🟨 | **PawZ Gold** | `#F7B334` | 247, 179, 52 | Logo field; overlay highlight text (`#FCB233`, unified here) | Primary brand color, highlight words, badge field |
| 🟥 | **Racing Red** | `#C53336` | 197, 51, 54 | Logo ring; end-card pill button | CTAs, buttons, pins, accents |
| 🟪 | **Midnight Navy** | `#1F1B30` | 31, 27, 48 | TikTok end-card background | Dark backgrounds, footer, hero overlays |
| ⬛ | **Night Box Navy** | `#282742` | 40, 39, 66 | Reel text-overlay boxes | The "PawZ Box" text container, cards on dark |
| ⬜ | **Husky Cream** | `#F6EEDE` | 246, 238, 222 | Logo white/cream areas | Warm light backgrounds (instead of stark white) |
| ⬜ | **White** | `#FFFFFF` | 255, 255, 255 | Overlay text | Text on dark, cards |
| ⬛ | **Checker Black** | `#121117` | 18, 17, 23 | Logo outlines, checkered flags | Checkered pattern, outlines, fine type |
| 🟪 | **Logo Navy** | `#2A1541` | 42, 21, 65 | Flags and "MOBILE DOG GYM" on the knockout logo | Matching the logo on light backgrounds only; not a UI color |

### Support shades
| Name | HEX | Role |
|---|---|---|
| **Pit Red** (dark) | `#9F1427` | Button hover/pressed, red gradients, shadow side of pill |
| **Gold Light** | `#FCD98A` | Soft highlight backgrounds, badges, gentle fills |
| **Slate Gray** | `#CFCBD8` | Secondary text on navy (e.g., sign-off line), dividers |
| **Ink Gray** | `#4A4658` | Body text on cream/white when pure navy feels heavy |

### Balance (60 / 30 / 10)
- **60%** neutrals: Husky Cream, White, or Midnight Navy (pick one per piece as the base).
- **30%** PawZ Gold *or* real photography.
- **10%** Racing Red, reserved for the **one** action (button, pin, key callout). If red is everywhere, the CTA stops standing out.

### Contrast (checked, WCAG)
| Combination | Ratio | Verdict |
|---|---|---|
| White on Midnight Navy | 16.7 : 1 | ✅ Best. Default for overlays and dark sections |
| Gold on Midnight Navy | 9.1 : 1 | ✅ Great for highlight words |
| Gold on Night Box Navy | 7.8 : 1 | ✅ Great (the PawZ Box highlight) |
| White on Night Box Navy | 14.4 : 1 | ✅ Great |
| Midnight Navy on Gold | 9.1 : 1 | ✅ Great (gold banners, badges) |
| Checker Black on Gold | 10.2 : 1 | ✅ Great |
| White on Racing Red | 5.4 : 1 | ✅ OK for buttons and bold text |
| White on Pit Red | 8.1 : 1 | ✅ Great |
| Midnight Navy on Husky Cream | 14.5 : 1 | ✅ Great for body text |
| Racing Red on Husky Cream | 4.7 : 1 | ⚠️ Bold/large text only |
| **Gold on Red** | 2.9 : 1 | ❌ Never for text (logo art only) |
| **Gold on White/Cream** | 1.8 : 1 | ❌ Never for text. Gold text only goes on navy or black |

### Color tokens (copy into any build)
```css
:root {
  --pawz-gold: #F7B334;
  --pawz-gold-light: #FCD98A;
  --racing-red: #C53336;
  --pit-red: #9F1427;
  --midnight: #1F1B30;
  --night-box: #282742;
  --husky-cream: #F6EEDE;
  --white: #FFFFFF;
  --checker-black: #121117;
  --slate: #CFCBD8;
  --ink: #4A4658;
}
```

---

## 4. Typography

Her reel overlays and end card use a **heavy, rounded geometric sans** (Poppins-style). We keep that as the backbone, add one friendly body face, and one racing accent used sparingly. All three are free Google Fonts, so they work in Canva, CapCut, Figma and the website.

| Role | Font | Weights | Use for |
|---|---|---|---|
| **Headline / display** | **Poppins** | ExtraBold 800, Black 900 | Headlines, PawZ Box text, ad headlines, end cards, buttons |
| **Body** | **Nunito** | Regular 400, SemiBold 600, Bold 700 | Paragraphs, captions on graphics, FAQs, forms |
| **Racing accent** (sparingly) | **Racing Sans One** | Regular (it's italic by design) | Small labels only: "LAP 1," "PIT STOP," "FINISH LINE," step numbers, stickers. Max 1 per piece, never paragraphs |
| **Location script** (optional) | **Yellowtail** | Regular | Only inside location stamps ("Woodland *California*"), matching her existing stamp style |

**Fallbacks:** Poppins → Montserrat ExtraBold → Arial Black. Nunito → system-ui → Arial.

### Type scale
| Element | 1080 × 1920 reel/story | 1080 × 1350 feed/ad | Website (mobile → desktop) |
|---|---|---|---|
| Hero / big headline | 84–110 px Poppins 900 | 72–96 px Poppins 900 | 36 → 60 px Poppins 800 |
| PawZ Box overlay | 56–64 px Poppins 800 | 52–60 px Poppins 800 | n/a |
| Subhead | 40–48 px Poppins 700 | 36–44 px Poppins 700 | 20 → 24 px Nunito 700 |
| Body on graphic | 34–38 px Nunito 700 | 30–34 px Nunito 700 | 17 → 18 px Nunito 400, line-height 1.6 |
| Fine print / sign-off | 28–30 px Nunito 600 | 26–28 px Nunito 600 | 14 px Nunito 600 |

### Type rules
- Headlines: **sentence case**, tight leading (1.05–1.15), max **2 lines** on a graphic.
- **One gold highlight per headline** (a word or short phrase), the rest white.
- No outlines/strokes on type *except* location stamps (see §5).
- No all-caps paragraphs. All-caps only for tiny labels (Racing Sans One or Poppins 800 with +4% letter-spacing).

---

## 5. Graphic elements (the kit)

| Element | Spec | When to use |
|---|---|---|
| **Checkered strip** | Checker Black + White squares; square size = 2.5% of canvas width (27 px on 1080); 2 rows tall | Top or bottom edge of statics, section dividers on the site, end-card base. One strip per piece |
| **Checkered corner flag** | Small waving flag icon (from logo style), Checker Black/White | Next to "finish"/"first session" moments, beside wordmark |
| **Paw prints** | Solid PawZ Gold or White, 3–5 in a diagonal "trail," 6–10% opacity on backgrounds, 100% when used as icons | Background texture, bullet icons, progress trail |
| **Red pill button** | Racing Red fill, fully rounded (radius = height/2), Poppins 800 white, padding 24 × 48 px (1080 canvas), subtle Pit Red bottom shadow (0 6px 0) | Every CTA: "Book your pup's first session," "speedypawz.com," "DM PAWZ" |
| **PawZ Box** (text container) | See §6 | All on-video text and most static headlines |
| **Location stamp** | Racing Red map pin + town name in Poppins 900 PawZ Gold with 4 px Checker Black stroke, optional Yellowtail "California" underneath in white | Lower third of reels, ad images ("Woodland CA," "Davis CA," "Yolo County") |
| **Callout arrows** | White, hand-drawn curved arrow, 6 px stroke + white rounded-outline label (as in her "Brought right to your door" reel) | Explaining features on real photos of the van and mills |
| **Speed lines** | 3 short horizontal White or Gold lines with rounded caps, trailing behind a subject or word | Light motion accent on "Speedy" headlines. Max one set per piece |
| **Trophy / award tag** | Gold rounded tag, Checker Black text, 🏆 replaced by a simple trophy icon | Community wins, "2nd place" posts |
| **Photo frame** | 24 px rounded corners, 8 px White border, soft shadow (0 12px 30px rgba(31,27,48,.25)) | Photos on cream/gold backgrounds, carousels |

**Icon style:** rounded, filled, 2-color max (Midnight + Gold or White + Red). Suggested set: van, paw, clock (30 min), thermometer/snowflake (climate-controlled), heart, camera (photo updates), first-aid cross, map pin, calendar.

---

## 6. The PawZ Box (text-overlay system)

This is her existing style. Locking it down makes every reel instantly recognizable.

**Spec (1080-wide canvas):**
- Fill: **Night Box Navy `#282742`** at 95% opacity.
- Corner radius: **28 px**.
- Padding: 28 px top/bottom, 40 px sides.
- Max width: 900 px (centered). Max **2 lines**.
- Type: **Poppins ExtraBold 800**, 56–64 px, **White**, centered.
- Highlight: **one word or phrase in PawZ Gold `#F7B334`**, usually the payoff ("**Mystery Machine**," "**2nd place!**," "**at your dog's pace**").
- Shadow: soft, 0 8px 24px rgba(0,0,0,.35).
- Placement on 9:16 video: inside the **safe zone** between y = 260 px and y = 700 px (upper third), clear of the platform's top bar. Never in the bottom 35% (captions, buttons and usernames cover it).
- Timing: on screen long enough to read twice (about 1.5–2.5 s for 5–8 words). One idea per box.
- Animation: quick pop-in (scale 90% → 100%, 150 ms), no bounce, no typewriter.

**Alternate (light) PawZ Box** for bright cream backgrounds: White fill, Midnight Navy text, Racing Red highlight word (bold only).

**Captions (spoken subtitles):** Nunito ExtraBold 44–48 px, White with a 6 px Midnight Navy stroke *or* sit inside a slim navy box. Bottom-middle of the safe zone, at roughly y = 1150–1300 px on 1920. Current spoken word may flash Gold.

---

## 7. Photography and video style

### Principles
- **Real first.** Emelyn, the van, the red mills, real client dogs. AI imagery only for backgrounds or invented graphic elements, and it must look ultra-realistic.
- **Never alter faces or real dogs.** Color, exposure, crop and cleanup are fine. No face smoothing, no reshaping, no swapping dogs.
- **Bright, warm, daylight.** Golden-hour van shots, open van door with sunlight, clean interior. Slight warmth (+5 to +10 temp), lift shadows, keep reds rich but not neon.
- **Eye-level with the dog.** Crouch down. Dog's face, tongue out, ears up. The dog is the hero; Emelyn is the guide.
- **Show the safety.** Emelyn's hand near the dog, treats and toys in frame, her watching. Never a dog alone on the mill, never a dog that looks stressed.

### The must-have shot list (build a library)
1. Van pulling up to a curb (exterior, logo visible) — "we come to you."
2. Open side door revealing both red slat mills — the "reveal."
3. Dog's first step on the mill with Emelyn coaching, treat in hand.
4. Close-up of paws on the slats (shows "dog-powered").
5. Dog trotting happily, tongue out, side angle with red frame in shot.
6. Emelyn high-five/treat moment at the end ("finish line").
7. **The PawZ nap:** dog asleep at home afterward (owner-supplied photo, with permission).
8. Owner receiving the photo update on their phone (over-the-shoulder).
9. Emelyn to camera in the checkered overalls, van behind her (talking-head hook).
10. Kira and Kiko together in bandanas (origin story).
11. Branded harness close-up.
12. Community: booth with checkered floor, shelter visits, costume events.

### Wardrobe = brand asset
On camera, Emelyn wears the **red-and-black checkered overalls** or a **solid red top** (her two most-used looks). These read as "Speedy PawZ" before the logo appears. Dogs wear bandanas (her clients already do: purple, floral, blue).

### Video language
- **Hook in the first 1–2 seconds:** motion (van door sliding, dog bolting onto the mill) or Emelyn's face mid-reaction.
- **Pacing:** a cut every 1–2 seconds for promo reels; slower (2–4 s) for calm/safety reels.
- **Music:** upbeat, feel-good pop/funk for fun posts; acoustic/lo-fi for safety and senior-dog posts. Licensed or platform library only.
- **Sound signature (proposed):** a short "start-line beep" or soft engine-rev-into-bark sting at 0:00 or on the end card, used every time. [present to Emelyn]
- **End card (lock this, she already made it):** see §9.

---

## 8. Layout system

- **Grid:** 1080 px canvas, 60 px outer margin, 12-column feel.
- **Corner radius family:** 28 px (boxes, cards), 24 px (photos), full-round (buttons, pins).
- **Hierarchy per piece:** 1 headline → 1 supporting line → 1 CTA. If a fourth element shows up, cut something.
- **Logo placement:** top-left (statics) or end card (video). Not both, unless it's an ad (then small watermark + end card).

### Meta placement safe zones (always design for these)
| Format | Size | Keep text/logo out of |
|---|---|---|
| Reels / Stories (9:16) | 1080 × 1920 | Top 14% (~270 px) and bottom 35% (~670 px); keep 6% (~65 px) side margins |
| Feed (4:5) | 1080 × 1350 | 60 px margin all sides |
| Square (1:1) | 1080 × 1080 | 60 px margin all sides |
| Landscape link/right column (1.91:1) | 1200 × 628 | Avoid tiny text; this placement is small |

---

## 9. Templates

### 9.1 Reel / TikTok end card (her current one, standardized)
- Background: **Midnight Navy `#1F1B30`**, optional faint paw-print trail at 6%.
- Logo **Version B**, 420 px wide, centered, top at y ≈ 420.
- "Woodland's mobile dog gym" — Poppins 800, 64 px, White.
- "We come to you" — Poppins 800, 56 px, PawZ Gold.
- Red pill: "speedypawz.com" (or the current CTA) — Poppins 800, 48 px, White on Racing Red.
- "Happy PawZ, Healthy Strides!" — Nunito 700, 40 px, Slate Gray.
- Optional checkered strip along the bottom edge (above the bottom safe zone it's fine to bleed off-canvas).
- Duration: 2–3 seconds.

### 9.2 Reel cover (grid thumbnail)
- Full-bleed real photo (dog or Emelyn's face).
- PawZ Box with 3–6 words, placed in the **center 1080 × 1350 area** so it survives the 4:5 grid crop.
- Logo not needed on covers (grid already shows the handle).

### 9.3 Instagram carousel (1080 × 1350)
- **Slide 1 (cover):** Real photo, big Poppins 900 headline (2 lines, one gold word) in a PawZ Box or on a navy gradient at the bottom; small "swipe" cue (gold arrow).
- **Middle slides:** Husky Cream background, Midnight text, one idea per slide, photo in rounded frame, step number in Racing Sans One on a gold circle.
- **Last slide:** Midnight Navy, logo B, one CTA in red pill, sign-off line.
- Checkered strip on slide 1 and the last slide only.

### 9.4 Story (1080 × 1920)
- Real photo/video, PawZ Box at top third, sticker (poll/question) in the middle, CTA link sticker above the bottom safe zone.
- Keyword stories: "DM **PAWZ**" with PAWZ in Gold inside a navy box.

### 9.5 Feed static / organic graphic
- Option A (photo-led): full photo + PawZ Box headline + small location stamp.
- Option B (announcement): Gold background, Midnight Navy headline, photo in rounded White frame, checkered strip at bottom, red pill CTA.

---

## 10. Ad layouts (Meta statics and video)

All ads: real photo, one message, one CTA, logo visible, place named. Build each at 4:5 and 9:16 (plus 1:1 if needed).

### Layout 1: "We come to you" hero ★ (start here)
- Photo: van at a curb, side door open, red mills visible, dog stepping in.
- Top: PawZ Box "Woodland's mobile dog gym. **We come to you.**"
- Bottom-left: location stamp "Woodland CA."
- Bottom: red pill "Book your pup's first session."
- Top-left: logo B watermark.

### Layout 2: "At your dog's pace" (objection: is it safe?)
- Photo: close-up of dog trotting on slats, Emelyn's hand with a treat in frame.
- White callout arrows: "No motor," "Dog sets the speed," "Coached with treats and praise."
- PawZ Box: "Your dog sets **the pace.**"
- Red pill CTA.

### Layout 3: "Zoomies to snoozies" (outcome)
- Split image, top/bottom (9:16) or left/right (4:5): energetic dog on the mill | the same dog napping at home. **Real photos of the same dog only, with owner permission.**
- Labels in Racing Sans One: "LAP 1" / "FINISH LINE."
- Headline: "From zoomies **to snoozies.**" Fine print: "Many owners notice a calmer evening." (No guarantees.)

### Layout 4: Meet Emelyn (trust)
- Photo: Emelyn in checkered overalls with a client dog in the van.
- Headline on Gold band: "Hi, I'm Emelyn. **I'll bring the gym to you.**"
- Three icon bullets (Nunito): one-on-one · climate-controlled · photo updates.
- Red pill CTA.

### Layout 5: Proof card (when real reviews exist)
- Husky Cream background, real review text (verbatim, with permission), first name + dog's name, real photo of that dog, 5-star row only if it's the actual rating. [CONFIRM reviews before building]

### Layout 6: Offer card (occasional, honest)
- Midnight Navy background, checkered strip, Gold headline with the real offer [CONFIRM], deadline only if real, red pill "DM PAWZ" or "Book now."
- Use for retargeting/Stories, not as the main brand ad.

### Video ad structure
Hook (0–3 s: van door slides open / dog bolts on) → Emelyn to camera (what it is, where) → how it works (3 quick shots) → proof/nap shot → end card (§9.1). PawZ Box for all on-screen text.

---

## 11. Landing page UI kit

### Section rhythm (top to bottom)
| Section | Background | Notes |
|---|---|---|
| Hero | Real photo with Midnight Navy gradient (top → 70% opacity bottom) | Headline White with one Gold word, red pill CTA, location line |
| VSL | Midnight Navy | Video in 24 px rounded frame, gold play button |
| Emelyn's story | Husky Cream | Photo of Emelyn + Kira & Kiko |
| How it works (3 steps) | White | Step numbers in Racing Sans One on Gold circles; checkered strip divider above |
| Who it's for | Husky Cream | 3 cards (high-energy, older, shy) with real dog photos |
| Safety / dog sets the pace | Midnight Navy | Icon list in Gold/White |
| Proof | White | Reviews (real only), photo grid, community logos/mentions |
| Pricing | Gold Light | [CONFIRM] cards on White |
| FAQ | Husky Cream | Accordion, Nunito |
| Booking | Midnight Navy | Two paths: red pill "Book a session" + outline button "Book a quick call" |
| Footer | Checker Black | Logo B, contact, service area, sign-off line |

### Components
- **Primary button:** Racing Red, White Poppins 700 18px, full-round, height 56 px, hover Pit Red, pressed shadow 0 4px 0 Pit Red. Text: "Book your pup's first session."
- **Secondary button:** transparent with 2 px White (on dark) or Midnight (on light) border, same shape.
- **Cards:** White, 24 px radius, 24 px padding, shadow 0 10px 30px rgba(31,27,48,.10).
- **Sticky mobile CTA bar:** Midnight Navy bar at bottom with red pill, appears after the hero.
- **Spacing:** 8 px base unit; section padding 64 px mobile / 112 px desktop.
- **Max content width:** 1120 px.

---

## 12. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use her real photos of Emelyn, the van and real client dogs | Use stock dogs or AI-generated "client" dogs |
| One gold highlight phrase per headline | Highlight three words in three colors |
| Keep the racing theme to one accent per piece (strip, flag *or* speed lines) | Stack flags, stripes, speed lines and paw prints all at once |
| Gold text only on navy/black | Gold text on white, cream or red |
| Red reserved for the CTA | Red headlines, red backgrounds behind red buttons |
| Show Emelyn beside the dog, treats in view | Show a dog alone on the mill or straining |
| Same end card on every reel | A new end card every week |
| Name the town (Woodland, Davis, Yolo) | Generic "near you" with no place |
| Keep text inside safe zones | Put the CTA in the bottom 35% of a reel |
| Clean, bright, warm edits | Heavy filters, neon glows, lens flares, plastic-looking AI |

---

## 13. Asset checklist (to collect from Emelyn)

- [ ] Logo source files (SVG/AI/EPS or 3000 px transparent PNG) and the font her designer used for "SPEEDY PAWZ" [CONFIRM]
- [ ] Van wrap/decal proof files
- [ ] 20–30 best photos (Emelyn, van exterior/interior, mills, client dogs, Kira & Kiko)
- [ ] Raw reel footage (unwatermarked originals, not TikTok downloads)
- [ ] Owner permission for each client dog used in ads
- [ ] Any existing brand colors/fonts she specified (we'll match these codes to them)
- [ ] Harness and merch photos

---

## 14. Quick reference card

```
COLORS   Gold #F7B334 · Red #C53336 · Midnight #1F1B30 · Box Navy #282742
         Cream #F6EEDE · White #FFFFFF · Checker Black #121117 · Pit Red #9F1427
TYPE     Poppins 800/900 (headlines) · Nunito (body) · Racing Sans One (labels only)
OVERLAY  Navy box #282742, 28px radius, Poppins 800 white, ONE gold phrase, max 2 lines
CTA      Red pill, white Poppins 800: "Book your pup's first session"
SIGN-OFF Happy PawZ, Healthy Strides!
CATEGORY Woodland's mobile dog gym · We come to you
NEVER    grooming · medical claims · dog alone/forced · gold text on light · invented proof
```
