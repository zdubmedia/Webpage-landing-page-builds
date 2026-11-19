/*
  Speedy PawZ landing page: the ONE file to edit for facts and switches.

  Rules
  - null means "not confirmed yet". The page shows an honest fallback, never a guess.
  - Visit the page with ?review=1 to see a gold CONFIRM note on every open item.
  - Visit with ?review=0 to turn review mode off again.
  - No em dashes and no emojis in any text you type here.
*/
window.SPZ_CONFIG = {
  business: {
    name: "Speedy PawZ Mobile Dog Gym",
    phoneDisplay: "(530) 808-5782",
    phoneE164: "+15308085782",
    email: "info@speedypawz.com",
    serviceArea: "Woodland, Davis, Sacramento & Yolo County",
    instagramHandle: "speedypawz_mobiledoggym" // used on the thank-you page only
  },

  // Shown as a hidden field on every request so you can A/B test later.
  pageVariant: "A",

  // "What are you interested in?" checkboxes on the booking form. [CONFIRM final list]
  // confirmed: false adds a review-mode note next to that option.
  services: [
    { label: "30-minute fitness session", confirmed: true },
    { label: "Weekly sessions", confirmed: true },
    { label: "Two dogs, same home", confirmed: false },
    { label: "Meet-and-greet", confirmed: false },
    { label: "Not sure yet, help me choose", confirmed: true }
  ],

  // Time-window chips. Add real hours as hint when Emelyn confirms, e.g. hint: "8 to 11 am". [CONFIRM]
  timeWindows: [
    { label: "Morning", hint: null },
    { label: "Midday", hint: null },
    { label: "Afternoon", hint: null },
    { label: "Evening", hint: null }
  ],

  // Days Emelyn works, 0 = Sunday ... 6 = Saturday. null = any day can be requested. [CONFIRM]
  serviceDays: null,

  // How many days out people can request (min is always tomorrow).
  bookingWindowDays: 7,

  // Prices as display text, e.g. "$45". null hides the price and shows the fallback line. [CONFIRM]
  prices: {
    firstSession: null,
    weekly: null
  },

  // Black Friday special. Shows only while active is true AND endDate (YYYY-MM-DD, California time) has not passed.
  promo: {
    active: false,
    label: "Black Friday special",
    details: null, // e.g. "Special pricing is live. Request below to lock it in." [CONFIRM]
    endDate: null // e.g. "2026-11-30" [CONFIRM]
  },

  // true renames the call tab to "Free meet-and-greet". null or false keeps "Quick call with Emelyn". [CONFIRM]
  freeMeetAndGreet: null,

  // e.g. "within 30 minutes during business hours". Only set if Emelyn commits to it. [CONFIRM]
  responseTimePromise: null,

  // A full sentence, e.g. "We travel up to 25 miles from Woodland." [CONFIRM]
  travelRadius: null,

  // A full sentence: what happens if a dog is not ready on the mill that day. [CONFIRM]
  notReadyPolicy: null,

  // Answers for FAQ questions we cannot answer yet. null shows the friendly fallback. [CONFIRM each]
  faq: {
    cost: null,
    beHome: null,
    sizeAge: null,
    vaccines: null,
    meetAndGreet: null
  },

  // Video slot. Set to "assets/video/intro.mp4" once the file is in place.
  vsl: {
    src: null,
    captions: null, // "assets/video/intro.vtt"
    poster: "assets/photos/emelyn-van-door-black-dog.jpg"
  },

  // Photo-realistic van frames. Set frameCount to the number of frames in assets/van-sequence/ (0001.webp, 0002.webp ...).
  // 0 keeps the illustrated SVG van scene.
  vanSequence: {
    frameCount: 0,
    path: "assets/van-sequence/",
    ext: "webp",
    digits: 4
  },

  // Live booking calendar. Example: { type: "iframe", src: "https://...", height: 760, name: "Square Appointments" }
  // When set, the "Request a session" tab shows the calendar first and the form as a fallback.
  calendarEmbed: null,

  // Older dogs photo for the "Who it's for" card. null shows the illustrated card.
  olderDogPhoto: null,

  // Meta pixel ID. null = off. Add the cookie notice to the footer before turning this on (see START-HERE.md).
  metaPixelId: null,

  // false turns off every animation for everyone. Visitors with reduce-motion on never see motion either way.
  motion: true
};
