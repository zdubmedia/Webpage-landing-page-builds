# Photo slots

Every photo on the page, where it shows and how big it gets. All are Emelyn's real photos, cropped from her posts.
When Emelyn sends originals, drop them in with the **same file name** (JPG, at least the width listed under "Ideal original"), then regenerate the WebP/AVIF versions (see the bottom of this file).

Rules: never alter faces or real dogs (crop, color and exposure only). No AI upscaling, no generated "client dogs". Owner permission for every client dog. [CONFIRM]

| File | Shows in | Shown at (max CSS width) | Current width | Ideal original |
|---|---|---|---|---|
| `dog-on-slat-mill.jpg` | Hero background (darkened), OG image | full screen | 1320 | 2400+ |
| `emelyn-and-pup-van.jpg` | Meet Emelyn flip card 1 and the VSL poster (her whole head in frame; cropped from an Instagram frame) | 340 | 477 | 1200+ |
| `emelyn-van-door-black-dog.jpg` | Not placed now (her head is cut off in this file) | 340 | 437 | 1200+ |
| `emelyn-and-son.jpg` | Meet Emelyn flip card 2 [CONFIRM OK to show Adan] | 340 | 438 | 1200+ |
| `huskies-on-the-mills.jpg` | Meet Emelyn flip card 3 [CONFIRM these are Kira and Kiko]. From her Instagram story; the caption text and arrows were cleaned off with an AI edit. Swap for her original. | 340 | 880 | 1200+ |
| `husky-bandana-mill.jpg` | Not placed now | 340 | 438 | 1200+ |
| `excited-pup-leash.jpg` | Who it's for: high-energy. Still for the clip `assets/video/excited-pup-leash.mp4`. AI footage. | 380 | 960 | n/a |
| `shy-pup-peek.jpg` | Who it's for: shy pups. Still for the clip `assets/video/shy-pup-peek.mp4`. AI footage (AI Emelyn). | 380 | 960 | n/a |
| `heeler-and-emelyn-mill.jpg` | Not placed now (real photo, cropped from an Instagram screenshot) | 380 | 1170 | 1600+ |
| `older-dog-rest.jpg` | Who it's for: older dogs. Still for the short clip `assets/video/older-dog-rest.mp4`. AI footage, not a client: swap for a real photo. | 380 | 960 | 1200+ |
| `black-lab-smiling-mill.jpg` | Sticker in the zoomies band | 120 | 437 | 1200+ |
| `emelyn-overalls-on-mill.jpg` | Not placed now | 380 | 437 | 1200+ |
| `emelyn-selfie-van.jpg` | Not placed right now (spare) | 380 | 438 | 1200+ |
| `van-mystery-machine.jpg` | Community trophy card | 380 | 1320 | 1600+ |
| `emelyn-velma-trunk-or-treat.jpg` | Not placed now | 380 | 1130 | 1600+ |
| `van-driveway.jpg` | How it works (first image, and the whole stage with reduced motion) | 1060 | 1320 | 2400+ |
| `coach-beside-mill.jpg` | Safety section photo | 480 | 984 | 1600+ |
| `client-dog-trot-mill.jpg` | photo inside the phone notification | 520 | 1187 | 1600+ |
| `emelyn-client-dog-van.jpg` | Not placed now | 520 | 978 | 1600+ |
| `love-pats.jpg` | Not placed now | 520 | 1320 | 2400+ |
| `van-emelyn-at-door.jpg` | Not placed yet (spare real van photo) | n/a | 1320 | 2400+ |
| *(empty)* older dog photo | Who it's for: older dogs (set `olderDogPhoto` in `site-config.js`) | 380 | none | 1200+ |

The six files above from `van-driveway` down were cropped out of Instagram screenshots (captions and icons cropped off). They are sharper than the first batch but still screenshots: ask Emelyn for the original videos or photos.

Small crops (about 440 px wide) are never shown wider than about 480 CSS px. Keep it that way until originals arrive.

## Regenerating sizes

For each JPG the page uses a `.webp` and `.avif` with the same name. The hero and the two big photos also have `-640`, `-960`, `-1320` (hero) or `-480`, `-800` (van, Velma) sizes.
Any image tool works (Squoosh, `cwebp`, Photoshop "Export As"). WebP quality about 78, AVIF about 55. Keep the hero version under 180 KB.
