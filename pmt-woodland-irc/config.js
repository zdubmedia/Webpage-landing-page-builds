/*
  PMT Woodland Intermediate landing page settings.
  This is the one file Zach edits. See README.md for plain-English steps.
*/
window.PMT_CONFIG = {
  links: {
    licensing: "https://register.msi5.com/webreg/production/reactapp/?book=cawood&SC=WLD&LAP=26&CC=1DPC", // NOT LICENSED YET (21+)
    licensed:  "https://register.msi5.com/webreg/production/reactapp/?book=cawood&SC=WLD&LAP=26&CC=IRC"   // ALREADY LICENSED
  },

  // Off by default. If true, append the visitor's utm_* params to the checkout links.
  // Turn on only after confirming the checkout page still loads correctly with extra params.
  passUtmsToCheckout: false,

  tracking: {
    metaPixelId: "",   // [CONFIRM] PMT's Meta pixel / dataset ID. "" = off.
    ga4Id: ""          // [CONFIRM] PMT's GA4 measurement ID (G-XXXXXXX). "" = off.
  },

  phoneDisplay: "(925) 373-4802",
  phoneTel: "+19253734802",

  entryTestVideoId: "RXr6xKW7IaA",

  // Woodland Intermediate dates. Past dates hide automatically (America/Los_Angeles).
  // status: "open" | "few" (shows "Few seats left") | "full" (shows "Full")
  // Use "few" only when the office confirms seats are actually low.
  dates: [
    { date: "2026-11-21", label: "Saturday, Nov 21, 2026", status: "open" }
    // [CONFIRM] next Woodland Intermediate date(s) after Nov 21
  ],

  stickyMobileCta: false,

  // Keep false until PMT confirms written permission from Total Control Training to use its logo.
  // When true, the page shows assets/total-control-logo.png in the credibility strip (add that file first).
  showTotalControlLogo: false,

  // Woodland Google rating (checked Nov 6, 2026: 5.0 from 126 reviews). Recheck before launch.
  // Shown as "5.0 ★ · 120+ Google reviews". The "+" keeps it true as reviews grow.
  woodlandRating: "5.0",
  woodlandReviewsShown: 120,

  privacyUrl: "https://www.pacificmotorcycletraining.com/legal/sms",

  // Turns off every animation (also off automatically for prefers-reduced-motion users).
  motion: true,

  // Crossfades the hero through 3 range photos after the first one loads.
  heroSlideshow: true
};
