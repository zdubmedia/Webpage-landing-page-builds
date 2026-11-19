# BUILD BRIEF: Speedy PawZ / Booking landing page (Netlify)

Paste everything below this line into Claude Code, opened in the unzipped `speedypawz-landing-kit` folder.

---

You are building a launch-ready, mobile-first booking landing page for **Speedy PawZ Mobile Dog Gym** (Woodland, CA) on behalf of ZDub Media (me, Zach). This page is a pitch to win Emelyn as a client, so it has to look and feel finished: branded, fast, a little bit magical, and built to convert. Ads, Instagram bio links and DMs will all send people here.

## 0. How to work

1. **Read first:** `brand/speedypawz-brand-guide.md` and `brand/speedypawz-visual-design-guide.md`. They are the source of truth for voice, facts, colors, type and rules. Then look at every file in `assets/`.
2. **Build locally**, then show me the page at phone width (390 x 844) and desktop (1440 x 900) with screenshots of every section, plus a short note on anything you couldn't do.
3. **Ask me before you change anything in any account** (Netlify, calendars, email). **Do not deploy until I say "deploy."**
4. Use the copy in section 5 word for word unless something breaks the layout. If you improve a line, show me the before and after.
5. Anything marked **[CONFIRM]** is a fact we don't have yet. Never invent prices, reviews, numbers, credentials, hours, client names or policies. Section 7 explains how [CONFIRM] items render.
6. Model tip from my mentor: plan with Fable, code with Opus. Use whichever you're on, but treat design polish as seriously as code.

## 1. The business (facts you may use)

- **Speedy PawZ Mobile Dog Gym.** Always write "Speedy PawZ" with a capital Z. Woodland's mobile dog gym. NOT grooming.
- A **climate-controlled van with two motorless, dog-powered slat mills** pulls up to the client's curb.
- **Customized 30-minute one-on-one sessions** at the dog's own pace. No motor, so the dog sets the speed. Coached with **praise, toys and treats, never force**.
- Includes **continuous safety monitoring**, a **pet first-aid kit on board** and **post-session photo updates**.
- For **high-energy dogs, older dogs slowing down, and shy pups** who don't do well in group settings.
- A **happy complement to your dog's daily walks**, never a replacement.
- **Owner:** Emelyn Hernandez (E-M-E-L-Y-N). Founder, mom to her son Adan, ballroom dancer, "living intentionally." Inspired by her huskies **Kira and Kiko**.
- **Service area:** Woodland, Davis, Sacramento & Yolo County.
- **Phone:** (530) 808-5782 · **Email:** info@speedypawz.com
- **Proof (Google review summary, paraphrase only, no fake quotes):** low-pressure, welcoming setup; dogs get comfortable before stepping on the slat mill; high energy release; weekly regulars who started after a raffle win; dogs that settle in for a deep nap afterward.
- **Community:** giving back to Yolo County Animal Shelter; donated a free-session raffle prize to the PAWS Pet Adoption & Wellness golf tournament (Davis, July 2026); prize partner for Soul Puppy Woodland's Halloween costume contest; 2nd place at her son's school trunk-or-treat with the van dressed as the Mystery Machine.
- **Current promo:** Black Friday special (details [CONFIRM]).
- **Signature phrases:** "Happy PawZ, Healthy Strides!" (sign-off, use in the footer and thank-you page), "Woodland's mobile dog gym," "We come to you," "We bring the gym to YOU," "at your dog's pace," "burns off excess energy," "Welcome to the pack," "Book your pup's first session."

## 2. The one goal and the "no escapes" rule

- **One action:** send a session request (or a quick-call request). Every button on the page smooth-scrolls to `#book`.
- **No escapes (Logan's golden rule):** no nav menu that leaves the page, no social links, no outbound links, no links to her current website. Mention sources as plain text. The only exceptions: the privacy page (it must have a big "Back to Speedy PawZ" button that returns to the page), and `tel:`/`sms:` links inside the booking section only.
- **CTA placement:** hero, after "How it works," after "Safety," right under pricing, final band before the footer, plus a sticky mobile bar that slides up after the hero and hides when `#book` is on screen.
- **Section-specific CTA wording** (all go to `#book`):
  - Hero: **Request my pup's first session**
  - After How it works: **Pick my times**
  - After Safety: **See if my dog's a fit**
  - Under pricing: **Request a session time**
  - Final band: **Request my pup's first session**
  - Sticky mobile bar: **Request a session**

## 3. Brand system (from the visual design guide)

```css
:root {
  --pawz-gold: #F7B334;      /* highlight words, badge field, accents */
  --pawz-gold-light: #FCD98A;
  --racing-red: #C53336;     /* buttons and CTAs ONLY */
  --pit-red: #9F1427;        /* button hover/pressed */
  --midnight: #1F1B30;       /* dark sections, hero overlay, footer */
  --night-box: #282742;      /* "PawZ Box" text containers, cards on dark */
  --husky-cream: #F6EEDE;    /* light sections (not stark white) */
  --white: #FFFFFF;
  --checker-black: #121117;  /* checkered pattern, outlines */
  --slate: #CFCBD8;          /* secondary text on dark */
  --ink: #4A4658;            /* body text on cream */
}
```

- **Fonts (Google Fonts, self-host or preconnect + `display=swap`):** Poppins 700/800/900 (headlines, buttons), Nunito 400/600/700 (body), Racing Sans One (tiny racing labels only: step numbers, "LAP 1", "FINISH LINE"; max one use per section).
- **Gold text only on navy or black.** Never gold on white, cream or red. Red is reserved for buttons.
- **One gold highlight word or phrase per headline**, the rest white (on dark) or midnight (on light).
- **Headlines and buttons centered on mobile.** Sentence case. Max 2 lines on phones where possible.
- **Buttons:** red pill, white Poppins 800, full radius, min height 56px, `0 6px 0 var(--pit-red)` bottom shadow, press squash.
- **PawZ Box:** her signature text container. `--night-box` at 95%, 28px radius, white Poppins 800 with one gold phrase. Use it for section labels and callouts on photos.
- **Checkered strip:** 2-row checker-black/white strip as section dividers (one per divider, never stacked with other racing effects).
- **Section rhythm:** dark (midnight) and light (cream) sections alternate. Cards are white, 24px radius, soft shadow.
- **Logo:** `assets/logo/speedypawz-logo-badge-primary.png` is the main logo (the yellow badge, same art as her van decal). Use it large in the hero. `speedypawz-logo-knockout-navy.png` only on cream/white. Never stretch, recolor or redraw. Favicon from `favicon-32.png` / `favicon-192.png`, plus an apple-touch-icon.
- **Look:** "race-day fun, neighbor-friendly." Bright, warm, clean, premium. The racing theme is a playful accent, never clutter. No generic AI look (no random neon, glows, lens flares, floating 3D blobs, stock dogs).
- **No emojis anywhere on the page.**

## 4. Photos and video

All in `assets/photos/` are Emelyn's real photos, cropped from her posts:

| File | What it is | Best use |
|---|---|---|
| `dog-on-slat-mill.jpg` (1320w) | Dog walking on a red-frame slat mill inside the van | Hero background (darkened) |
| `van-mystery-machine.jpg` (1320w) | The van dressed as the Mystery Machine | Community / trophy card |
| `emelyn-velma-trunk-or-treat.jpg` (1130w) | Emelyn as Velma by the van | Community card, photo reel |
| `emelyn-van-door-black-dog.jpg` (437w) | Emelyn in her checkered overalls with a client dog | Story flip card 1, reel |
| `emelyn-overalls-on-mill.jpg` (437w) | Emelyn with a dog on the mill | Reel, safety section |
| `emelyn-and-son.jpg` (438w) | Emelyn with her son Adan | Story flip card 2 [CONFIRM she's OK showing Adan] |
| `husky-bandana-mill.jpg` (438w) | Husky in a bandana on the mill | Story flip card 3, "who it's for" |
| `black-lab-smiling-mill.jpg` (437w) | Black lab smiling on the mill | "Who it's for," reel |
| `emelyn-selfie-van.jpg` (438w) | Emelyn smiling by the van | Reel, booking section |

Rules:
- The small crops are ~440px wide. Never display them wider than ~480px CSS on desktop or blow them up full-bleed. Design around it (polaroid cards, rounded frames, reel windows).
- **Never alter faces or real dogs.** Crop, color and exposure tweaks are fine. No AI upscaling, face smoothing or generated "client dogs."
- Export WebP/AVIF with JPEG fallback, `srcset`, lazy-load everything below the fold, and set width/height to prevent layout shift.
- Build an `assets/photos/README.md` listing every photo slot so originals from Emelyn can be dropped in later at higher resolution with the same names.
- **Video:** if `assets/video/intro.mp4` exists, show it in the VSL slot (muted autoplay preview with a big "Tap to watch with sound" button, poster image, captions if a `.vtt` exists). If no video exists, the VSL section stays hidden (the code and styling are in place, toggled by config). Later this becomes her full VSL.
- If `assets/van-sequence/` exists (numbered frames), use it for the van scene (see 6.3). Otherwise use the SVG version.

## 5. Page structure and copy (mobile-first, top to bottom)

No em dashes anywhere in page copy. Plain English, short sentences, talking to one dog owner on a phone.

### 5.1 Hero (first phone screen must hold everything here)
Background: `dog-on-slat-mill.jpg` with a midnight gradient overlay (dark enough for white text to pass contrast), faint paw-print texture.

- Big logo badge, centered (about 150-180px wide on phones).
- Eyebrow (small PawZ Box): **Woodland's mobile dog gym · We come to you**
- **H1 (use option A):**
  - **A (use this):** How a 30-minute stop at your curb turns zoomies into **snoozies** *(gold on "snoozies")*. Reason: it opens a loop ("how?"), paints the calm-dog payoff owners want, and says "we come to you" without a long sentence.
  - B: What if your dog's workout pulled up to **your driveway**?
  - C: The dog gym that comes to **your curb**
- Subhead: One-on-one fitness sessions on dog-powered slat mills, inside our climate-controlled van. Your dog sets the pace. You don't drive anywhere.
- Button: **Request my pup's first session**
- Under the button (small): Takes about a minute. Emelyn will reach out to lock in a time.
- Stat chips row (3): **30-minute sessions** · **0 motors. Your dog sets the speed** · **Photo update after every session**
- Area line (small): Serving Woodland, Davis, Sacramento & Yolo County

### 5.2 VSL slot (hidden until a video exists)
Label: **See Speedy PawZ in action**. 16:9 or 9:16 frame based on the video, rounded, gold play button. Hidden via config when there's no file.

### 5.3 How it works: the van scene (signature moment, see 6.3)
- Label: **How it works**
- H2: We bring the gym to **YOU**
- Beat 1 (LAP 1): **We pull up to your curb.** No driving, no loading up the car, no waiting room.
- Beat 2 (LAP 2): **Your pup warms up at their own pace.** Praise, toys and treats. Never force. We take time to get comfy before the first step.
- Beat 3 (LAP 3): **A happy 30-minute workout.** Two dog-powered slat mills, no motor. Your dog sets the speed while Emelyn coaches the whole time.
- Beat 4 (FINISH LINE): **Photo update, plus a tired, happy pup.** You get pictures after every session. Plenty of pups settle in for a deep nap afterward.
- Button: **Pick my times**

### 5.4 Meet Emelyn (story + flip cards)
- Label: **Meet your coach**
- H2: Hi, I'm Emelyn. **Welcome to the pack!**
- Story (first person) [CONFIRM wording with Emelyn]:
  > Speedy PawZ started with my two huskies, Kira and Kiko. Huskies are born to run, and some days a walk just wasn't enough. Too hot, too smoky, too rainy, or just too busy.
  >
  > So I created a gym that could go anywhere: a climate-controlled van with two dog-powered slat mills. No motors. No pressure. Just happy dogs moving at their own pace.
  >
  > Now I bring it right to your door. I'm a mom, a dog lover and a proud part of this community, and I treat every pup like one of my own.
- Three flip cards (tap on mobile, hover on desktop, keyboard accessible, a small "Tap to flip" hint with a rotating arrow icon):
  1. Front: `emelyn-van-door-black-dog.jpg`, caption **Emelyn Hernandez, founder**. Back: Founder and coach of Speedy PawZ · Mom to Adan · Ballroom dancer, so I know the joy of moving · Living intentionally.
  2. Front: `emelyn-and-son.jpg`, caption **Building this dream together**. Back: Speedy PawZ is mom-owned and based in Woodland, CA. One-on-one with your pup, every session [CONFIRM].
  3. Front: `husky-bandana-mill.jpg`, caption **The pups who started it all**. Back: Kira and Kiko are the huskies behind Speedy PawZ. They showed me what a good run can do for a dog's whole day. [CONFIRM this photo is one of them]
- Backs use the PawZ Box style (navy, white text, gold title).

### 5.5 Who it's for
- Label: **Who it's for**
- H2: Is Speedy PawZ right for **your pup**?
- Three cards:
  1. **High-energy pups** (`black-lab-smiling-mill.jpg`): Zoomies at 9 pm? Chewed-up shoes? A good run helps burn off that extra energy.
  2. **Older dogs slowing down** (no photo yet: use a clean illustrated icon card, and a photo slot for later): Gentle, steady movement at a pace that feels good to them. No rush, ever.
  3. **Shy pups** (`husky-bandana-mill.jpg` or another real photo): No dog park crowds. Just your pup, Emelyn and a calm, one-on-one space.
- Line under the cards: And for busy owners: we come to you, so your dog gets a real workout even on your busiest day.
- "Good to know" chips: **A happy complement to your daily walks** · **Dog fitness, not grooming** · **Private sessions, never a group class**

### 5.6 Safety: your dog sets the pace
- Label: **Safety first**
- H2: Your dog sets the pace. **Always.**
- Lead: Our slat mills have no motor. Your dog powers every step, so they can slow down, speed up or stop whenever they want.
- **Interactive pace dial** (see 6.4) with labels **Sniff and stroll · Happy trot · Full zoomies** and caption: Drag to try it. Your dog's choice, every time.
- Safety list with clean icons:
  - Emelyn is with your dog the entire session
  - Praise, toys and treats. Never force.
  - Pet first-aid kit on board
  - Climate-controlled van for hot, smoky or rainy days
  - One-on-one, so shy pups can relax
  - Photo update after every session
- Small note: Have a dog with a health condition? Check with your vet first, then let's talk.
- Button: **See if my dog's a fit**

### 5.7 Proof: Happy PawZ
- Label: **Happy PawZ**
- H2: What happens after a **Speedy PawZ** session?
- Counters (count up when they enter view; speedometer-needle sweep under each number):
  - **30** minute one-on-one sessions
  - **2** dog-powered slat mills
  - **0** motors
  - (4th tile, no counter) camera icon + **Photo update after every session**
- "What clients mention in their Google reviews" (bullets, paraphrased, no quotation marks, no star graphics): a low-pressure, welcoming setup · dogs who get comfortable before they step on · plenty of energy burned · pups who settle in for a deep nap afterward · raffle winners who became weekly regulars. Small source line in plain text: Summarized from Speedy PawZ reviews on Google. [CONFIRM: swap in real quotes with names and permission]
- **The PawZ Reel** (View-Master-style photo reel, see 6.5) with all real photos.
- Sub-section H3: Part of the pack, **on and off the mill**. Four trophy-style cards (plain text, no links):
  - Giving back to shelter pups with **Yolo County Animal Shelter**
  - Free-session raffle prize for the **PAWS Pet Adoption & Wellness** golf tournament in Davis
  - Prize partner for **Soul Puppy Woodland's** Halloween costume contest
  - **2nd place** at a local school trunk-or-treat, with the van dressed as the Mystery Machine (use `van-mystery-machine.jpg` and/or `emelyn-velma-trunk-or-treat.jpg`)

### 5.8 Pricing
- Label: **Pricing**
- H2: Simple plans for **happy pups**
- Cards come from config (see 7). Until prices are confirmed:
  - **First session**: 30 minutes, one-on-one, at your curb. Price: [CONFIRM]
  - **Weekly regulars**: same day and time each week. Price: [CONFIRM]
  - **Black Friday special** (show only while `promo.active` is true, with a real end date): Special pricing is live. Request below to lock it in. [CONFIRM details and end date]
- Fallback line when prices are missing: Send a request and Emelyn will text you current pricing and open times.
- Button directly under pricing: **Request a session time**

### 5.9 Straight answers (FAQ accordion)
Confirmed answers:
1. **Is a treadmill safe for my dog?** Our slat mills have no motor, so your dog powers every step and sets the speed. Emelyn stays with your dog the whole session, coaches with praise, toys and treats, and never forces anything. There's a pet first-aid kit on board. If your dog has a health condition, check with your vet first.
2. **What if my dog won't get on?** That's okay! We keep it low-pressure and let your pup get comfortable first. [CONFIRM: what happens if a dog isn't ready that day]
3. **Why pay when I can walk my dog?** Keep the walks! Speedy PawZ is a happy complement to them. It's great for high-energy days, busy days, and days when it's too hot, smoky or rainy to be outside.
4. **How long is a session?** About 30 minutes, customized to your dog.
5. **Where do you go?** Woodland, Davis, Sacramento and Yolo County. Not sure if you're in range? Send a request and we'll let you know. [CONFIRM travel radius]
6. **Is this grooming?** Nope! Speedy PawZ is all about fitness and fun. We're a mobile dog gym.
7. **What happens after I send a request?** Emelyn reaches out to ask a few quick questions and lock in a time that works for you. [CONFIRM response time promise, e.g. "within 30 minutes during business hours"]

Unconfirmed (from config; fallback answer "Great question! Emelyn will go over this with you when she reaches out."):
8. **What does it cost?** [CONFIRM]
9. **Do I need to be home?** [CONFIRM]
10. **Is my dog the right size or age?** [CONFIRM size, breed and age limits]
11. **Do you need vaccine records?** [CONFIRM intake requirements]
12. **Do you offer a meet-and-greet?** [CONFIRM]

### 5.10 Booking: service request (`#book`)
- Label: **Book**
- H2: Let's get your pup **on the schedule**
- Sub: Pick what you're interested in and two times that work for you. Emelyn will reach out to ask a few quick questions and lock in your time. [CONFIRM: add "within 30 minutes during business hours" only if Emelyn commits to it]
- **Two paths as tabs:**
  - **Request a session** (default)
  - **Quick call with Emelyn** (label becomes **Free meet-and-greet** if `config.freeMeetAndGreet` is true)

**Path 1: Request a session** (3-step form, progress shown as 3 paw prints filling in gold; one step per screen on phones; Back/Next buttons; validation inline and friendly):
- Step 1, **Your pup:** dog's name (required) · breed or mix · size chips (Small / Medium / Large / XL) · age chips (Puppy / Adult / Senior) · "My dog is..." multi-select chips (High energy / Slowing down / Shy around other dogs / Not sure).
- Step 2, **Services and times:**
  - "What are you interested in?" checkboxes from `config.services` [CONFIRM final list]. Defaults: 30-minute fitness session · Weekly sessions · Two dogs, same home [CONFIRM] · Meet-and-greet [CONFIRM] · Not sure yet, help me choose.
  - "Pick two times that work for you": Choice 1 and Choice 2, each = date (min: tomorrow; max: `config.bookingWindowDays` days out, default 7) + time window chips (Morning / Midday / Afternoon / Evening) [CONFIRM real hours and days; set in config]. Choice 1 required, Choice 2 strongly encouraged.
- Step 3, **You:** first and last name · mobile number (required, formatted as you type) · email · city (Woodland / Davis / Sacramento / Other Yolo County / Other) · street or cross streets (optional, "so we know where to park") · best way to reach you (Text / Call / Email) · anything else we should know (textarea) · SMS consent checkbox, unchecked by default: "Yes, Speedy PawZ can text me about my request. Msg and data rates may apply. Reply STOP to opt out. See our privacy policy." (privacy link opens the privacy page).
- Submit: **Send my request**

**Path 2: Quick call with Emelyn** (one short screen): first name · mobile · best time to call (chips: Morning / Afternoon / Evening) · dog's name · question (optional) · same SMS consent. Submit: **Request my call**.

Under both forms (plain, small): Prefer to text? **(530) 808-5782** (`sms:` and `tel:` links allowed here).

**Form tech:**
- Use **Netlify Forms** (`data-netlify="true"`, `netlify-honeypot`, a static hidden copy of every field so Netlify detects them at deploy). Two forms: `session-request` and `call-request`. Submit with `fetch` (AJAX) so the multi-step UI works, then redirect to `/thank-you.html?name=...`.
- Include hidden fields: `source` (utm_source/utm_campaign from the URL, stored in sessionStorage on landing), `page_variant`.
- **Calendar-ready:** add `config.calendarEmbed` (null for now). When I give you an embed (Square Appointments, Calendly, GoHighLevel or whatever Emelyn uses for her "new client booking portal" [CONFIRM which]), the "Request a session" tab shows the live calendar first and the request form as a "Can't find a time?" fallback. Any calendar must redirect to the thank-you page after booking.
- Notifications: after deploy, I'll want form notification emails to info@speedypawz.com and to me. Subject format: `New Speedy PawZ request: {dog name} ({city})`. Ask me before setting this up.

### 5.11 Final CTA band
Midnight background, checkered strip on top, H2: Ready to turn zoomies into **snoozies**? Button: **Request my pup's first session**.

### 5.12 Footer
Primary badge logo, "Happy PawZ, Healthy Strides!" in slate, "Serving Woodland, Davis, Sacramento & Yolo County," "(530) 808-5782 · info@speedypawz.com" as plain text, "Privacy policy" link, © year Speedy PawZ Mobile Dog Gym. No social icons.

### 5.13 Thank-you page (`thank-you.html`)
- Big checkered flag that waves in, paw-print confetti burst (respect reduced motion).
- H1: You're on the starting line, **{first name}**! (fallback without name: You're on the starting line!)
- "Here's what happens next": 1) Emelyn reviews your request. 2) She reaches out to confirm a time [CONFIRM response time]. 3) The van pulls up to your curb.
- "Save our number" button that downloads a vCard (Speedy PawZ, (530) 808-5782, info@speedypawz.com) so her text isn't a stranger's number.
- After conversion, outs are OK: small "Follow along" link to Instagram @speedypawz_mobiledoggym.
- Sign-off: Happy PawZ, Healthy Strides!
- If `config.metaPixelId` is set, fire `Lead` here (pixel off by default).

### 5.14 Privacy page (`privacy.html`)
Plain, readable privacy policy for a small local service business: what the forms collect, how it's used (to respond and schedule), SMS consent and opt-out (STOP/HELP), no selling of data, Netlify as form processor, contact info@speedypawz.com. Big "Back to Speedy PawZ" button at top and bottom. Mark [CONFIRM legal review].

## 6. Effects and animation (premium, lightweight, never in the way)

Use **GSAP + ScrollTrigger** (free, self-hosted in `/vendor`) and vanilla JS. No frameworks needed. Every effect must: work at 60fps on a mid-range phone, never hide content from readers, and fully respect `prefers-reduced-motion` (show the final static state).

### 6.1 Hero start sequence (under 1.2s, decorative only; text is readable instantly)
Three small start lights blink red, red, gold. The logo badge rolls in like a wheel (rotate + slide, slight bounce on landing) while the checkered flags in a thin strip wave. Headline words rise in with a stagger, then a gold marker-swipe draws under "snoozies." Button gets a slow shine sweep every ~6s.

### 6.2 Race-track scroll progress
A thin checkered track fixed at the very top. A tiny husky runner (simple SVG) moves along it with scroll progress. A checkered flag sits at the end and waves when `#book` comes into view.

### 6.3 The van scene (the "how did they do that?" moment)
Pinned, scroll-scrubbed sequence inside "How it works" (about 200vh desktop, 160vh phone, never longer):
1. A clean, polished **SVG illustration** of the Speedy PawZ van (black van, the real badge PNG as the side decal, red-accented wheels) rolls in from the right along a simple Woodland street (soft trees, curb, morning light) and stops with a little brake squash. Beat 1 text appears.
2. The big **side door slides open**. Beat 2.
3. The camera **zooms through the doorway** into a bright interior: two **red-frame slat mills** with slats moving, two husky silhouettes trotting (slat speed and trot follow scroll speed, with gentle smoothing). Beat 3.
4. A phone pops up with a photo-update notification ("Your pup crushed it today!") over a sleepy dog on a rug. Beat 4. Button: **Pick my times**.
- Text beats sit in PawZ Boxes with LAP 1 / LAP 2 / LAP 3 / FINISH LINE labels.
- Style: flat-but-rich vector with soft shading, brand colors, no cartoon clutter. Keep it sharp and clean.
- Reduced motion or no JS: show the 4 beats as a vertical card list with the final van illustration.
- **Upgrade path (build the hook now):** if `assets/van-sequence/0001.webp...` frames exist, replace the SVG with a canvas image-sequence scrubbed by scroll (Apple-style), preloaded progressively. That lets us later drop in an ultra-realistic render of her actual van (door opening, push-in to the mills, dogs trotting) without rebuilding the section. Write the frame naming and specs in the README.

### 6.4 Pace dial (safety section)
A slider styled as a speedometer (red needle, gold arc, checkered center cap). Dragging it changes the slat speed of a small slat-mill SVG and the dog's gait (stroll / trot / zoomies) and swaps the label. Large touch target, keyboard arrows work, `aria-valuetext` reads the label.

### 6.5 The PawZ Reel (photo carousel)
A **View-Master-style reel**: a racing-red disc with 7 to 9 photo windows around the ring. Tap the left/right buttons (or swipe) and the disc rotates one notch with a satisfying snap and tiny overshoot; the active photo enlarges in a "viewer" frame above it with a one-line caption. Optional soft click sound only after the first user tap, muted by default. Autoplays slowly until touched; pauses off-screen. Accessible: buttons labeled, photos have alt text, works with arrow keys.

### 6.6 Everything else
- Section reveals: fade and rise 24px with a short stagger as they enter (IntersectionObserver).
- A dotted paw-print trail draws itself between sections (SVG stroke animation).
- Counters count up with an easing that slows at the end; a speedometer needle sweeps under each.
- Flip cards: real 3D flip with backface hidden.
- Buttons: shine sweep, press squash, magnetic hover on desktop only.
- Form: paw progress fills; on success, a quick checkered-flag wipe before redirect.
- Easter egg: tap the hero logo 3 times and a husky zooms across the screen with speed lines.

## 7. Config, [CONFIRM] handling and review mode

- Put every toggle and unconfirmed fact in one file, `site-config.js`: phone, email, service area, `services[]`, time windows, `bookingWindowDays`, `prices` (null), `promo { active, label, details, endDate }`, `freeMeetAndGreet` (null), `responseTimePromise` (null), FAQ answers for unconfirmed questions (null), `vslSrc` (null), `calendarEmbed` (null), `metaPixelId` (null).
- **Production rendering:** null values never show brackets. Use the honest fallbacks written above (e.g., "Send a request and Emelyn will text you current pricing and open times").
- **Review mode:** visiting `/?review=1` shows a small gold sticky note on every unconfirmed item ("CONFIRM: prices", "CONFIRM: response time," etc.) plus a floating list of all open items. I'll use this when walking Emelyn through the page.

## 8. Technical requirements

- Plain static site: `index.html`, `thank-you.html`, `privacy.html`, `/css`, `/js`, `/vendor`, `/assets`. No build step required (so Netlify Forms detection is simple and anyone can edit it later).
- Mobile-first, tested at 360, 390 and 430 widths, then tablet and desktop. No horizontal scroll at any width.
- Performance: Lighthouse mobile Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+. Hero image under ~180KB. Preload the hero image and logo. Defer non-critical JS.
- Accessibility: semantic headings, visible focus states, 44px minimum touch targets, contrast AA everywhere (gold text only on navy/black), form labels and error messages announced.
- SEO and sharing: title "Speedy PawZ Mobile Dog Gym | Woodland's mobile dog gym, we come to you"; meta description from the subhead; Open Graph image (1200x630) built from the hero (logo + headline on midnight); LocalBusiness JSON-LD with name, phone, email, areaServed (Woodland, Davis, Sacramento, Yolo County). Include "Speedy Paws" only in meta keywords/JSON-LD alternateName, never in visible copy.
- Favicon set from the badge.
- No em dashes in any visible text. Run a search before you show me.

## 9. Deploy to Netlify (only after I say "deploy")

1. Use the Netlify connector or the Netlify CLI (`npx netlify-cli`). Log in through the browser when needed; tell me what to click if you need me.
2. List my existing Netlify sites first. I have at least two (the ZDub Media page is one and must not be touched). **Create a new site** named `speedypawz` (or `speedypawz-mobile-dog-gym` if taken). If my plan blocks a new site, stop and ask me; I may let you reuse the old PMT site instead.
3. Deploy, then confirm both forms appear under Forms in Netlify. Ask me before turning on email notifications (to info@speedypawz.com and me).
4. **Do not touch DNS or speedypawz.com.** She has a live website there. A subdomain like `book.speedypawz.com` is a later step that needs Emelyn's OK.
5. After deploy: submit one test request and one test call request from a phone-sized viewport, confirm they land in Netlify and the thank-you page shows the name, then delete the test submissions.
6. Send me the live URL plus phone screenshots.

## 10. Handoff files (write these in the project root)

- `START-HERE.md`: written for any future Claude session. What this site is, file map, how to edit copy and config, how to add the VSL, calendar, van frame sequence and pixel, how to deploy, the "no escapes" rule, and the list of open [CONFIRM] items.
- `FOR-EMELYN.md`: a one-page, plain-English note for the owner: requests arrive by email (subject line format), reply fast (texting within minutes wins the booking), what each field means, and "text Zach to change prices, hours or services."

## 11. Before you show me, check every item

- [ ] Hero fits on one 390 x 844 screen: logo, eyebrow, H1, subhead, button, chips.
- [ ] Headlines and buttons centered on mobile; one gold highlight per headline; red only on buttons.
- [ ] No outbound links except privacy (with a working "Back" button) and tel/sms in the booking section.
- [ ] Every button lands on `#book`; sticky bar shows after the hero and hides at `#book`.
- [ ] No invented facts, prices, reviews, numbers or hours; null config values show honest fallbacks; `?review=1` shows every [CONFIRM].
- [ ] No grooming language, no medical claims, no guarantees; dogs never shown or described as forced or left alone.
- [ ] No em dashes and no emojis in visible text. Brand name is "Speedy PawZ" everywhere.
- [ ] Both forms submit (locally simulate; real test after deploy), validation is friendly, SMS consent unchecked by default.
- [ ] Van scene, pace dial, PawZ Reel, flip cards and counters all work by touch, mouse and keyboard, and degrade cleanly with reduced motion.
- [ ] No faces or dogs altered; small photos never shown oversized.
- [ ] Lighthouse mobile scores meet the targets; no layout shift on load.
- [ ] `START-HERE.md` and `FOR-EMELYN.md` written.

When you're done, give me: phone + desktop screenshots of every section, the Lighthouse scores, the list of open [CONFIRM] items, and 3 ideas you'd add next. Then wait for "deploy."
