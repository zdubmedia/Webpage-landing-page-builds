# Photo slots

Every photo on the page, where it shows and how big it gets. All are Emelyn's real photos, cropped from her posts.
When Emelyn sends originals, drop them in with the **same file name** (JPG, at least the width listed under "Ideal original"), then regenerate the WebP/AVIF versions (see the bottom of this file).

Rules: never alter faces or real dogs (crop, color and exposure only). No AI upscaling, no generated "client dogs". Owner permission for every client dog. [CONFIRM]

| File | Shows in | Shown at (max CSS width) | Current width | Ideal original |
|---|---|---|---|---|
| `dog-on-slat-mill.jpg` | Hero background (darkened), OG image | full screen | 1320 | 2400+ |
| `emelyn-van-door-black-dog.jpg` | Meet Emelyn flip card 1, VSL poster | 340 | 437 | 1200+ |
| `emelyn-and-son.jpg` | Meet Emelyn flip card 2 [CONFIRM OK to show Adan] | 340 | 438 | 1200+ |
| `husky-bandana-mill.jpg` | Meet Emelyn flip card 3 [CONFIRM Kira or Kiko], PawZ Reel | 340 | 438 | 1200+ |
| `black-lab-smiling-mill.jpg` | Who it's for: high-energy, PawZ Reel | 380 | 437 | 1200+ |
| `emelyn-overalls-on-mill.jpg` | Who it's for: shy pups | 380 | 437 | 1200+ |
| `emelyn-selfie-van.jpg` | Not placed right now (spare) | 380 | 438 | 1200+ |
| `van-mystery-machine.jpg` | Community trophy card, PawZ Reel | 380 | 1320 | 1600+ |
| `emelyn-velma-trunk-or-treat.jpg` | PawZ Reel | 380 | 1130 | 1600+ |
| `van-driveway.jpg` | How it works (first image, and the whole stage with reduced motion), PawZ Reel | 1060 | 1320 | 2400+ |
| `coach-beside-mill.jpg` | Safety section photo, PawZ Reel | 480 | 984 | 1600+ |
| `client-dog-trot-mill.jpg` | PawZ Reel, photo inside the phone notification | 520 | 1187 | 1600+ |
| `emelyn-client-dog-van.jpg` | PawZ Reel | 520 | 978 | 1600+ |
| `love-pats.jpg` | PawZ Reel, and Lap 2 of the scroll scene (`assets/scene/*/pats.webp`) | full screen | 1320 | 2400+ |
| `van-emelyn-at-door.jpg` | Not placed yet (spare real van photo) | n/a | 1320 | 2400+ |
| *(empty)* older dog photo | Who it's for: older dogs (set `olderDogPhoto` in `site-config.js`) | 380 | none | 1200+ |

The six files above from `van-driveway` down were cropped out of Instagram screenshots (captions and icons cropped off). They are sharper than the first batch but still screenshots: ask Emelyn for the original videos or photos.

Small crops (about 440 px wide) are never shown wider than about 480 CSS px. Keep it that way until originals arrive.

## Regenerating sizes

For each JPG the page uses a `.webp` and `.avif` with the same name. The hero and the two big photos also have `-640`, `-960`, `-1320` (hero) or `-480`, `-800` (van, Velma) sizes.
Any image tool works (Squoosh, `cwebp`, Photoshop "Export As"). WebP quality about 78, AVIF about 55. Keep the hero version under 180 KB.
