# Van frame sequence (photo-realistic upgrade for "How it works")

Today the "How it works" scene is an SVG illustration. When a realistic render of Emelyn's actual van exists, drop numbered frames here and the page scrubs them with scroll instead (Apple-style). No code changes needed.

## Steps
1. Export frames as `0001.webp`, `0002.webp`, ... (4 digits, no gaps).
2. In `site-config.js` set `vanSequence.frameCount` to the number of frames.
3. Reload. The beat text boxes (Lap 1, Lap 2, Lap 3, Finish line) keep working on top.

## Frame specs
- **Count:** 120 to 180 frames. More is smoother but heavier.
- **Size:** 1600 x 900 (16:9). Keep the subject in the center 900 x 900 so phones (which crop the sides) still see the van.
- **Format:** WebP, quality about 70, aim for 40 to 80 KB per frame (about 6 to 10 MB total).
- **Story, by scroll progress:**
  - 0 to 25%: van rolls in from the right along a Woodland street and stops at the curb (Lap 1).
  - 25 to 50%: big side door slides open (Lap 2).
  - 50 to 78%: camera pushes through the doorway to the two red slat mills, dogs trotting, Emelyn coaching with treats (Lap 3).
  - 78 to 100%: home scene, pup napping, phone shows the photo update (Finish line).
- **Rules:** her real van and logo, no invented dogs presented as clients, nothing that looks forced. Leave the top-left area of each frame calm, since the text box sits there on desktop.

Frames load progressively (frame 1, then every 8th, then the rest), so the scene works before all frames arrive.
