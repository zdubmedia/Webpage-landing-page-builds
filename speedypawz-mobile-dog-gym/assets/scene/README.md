# Scroll-scene footage ("How it works")

The "How it works" section is a pinned, scroll-scrubbed scene. The footage is a set of still frames that the page steps through as the visitor scrolls (the same technique Apple uses on product pages). The engine is `js/scene.js`.

## The idea: the van is on the page, not in a video box

Some shots are **seamless**: the subject sits on one flat background color, and the page behind the footage is painted the same color. So the van reads as rolling across the page itself.

- Van shots were generated on a flat gold studio background, then color-matched so that gold is exactly brand gold `#F7B334`.
- The exploded mill sits on a navy studio background; the page takes its color from the frame edges.
- The other shots (real photo, treadmill clip, nap) fill the screen on desktop and sit as rounded tiles on phones.

## What is here now

| Beat | Shot | Source | Files | Mode |
|---|---|---|---|---|
| Lap 1 | Van drives in from the left edge of the page and parks | Kling 4.0, gold studio | `v-00` to `v-26` | seamless |
| Lap 1 (continued) | Side door slides open, camera pushes to the doorway | Kling 4.0, gold studio | `p-00` to `p-29` | seamless |
| Lap 2 | Emelyn giving love pats | Real photo | `pats` | tile |
| Lap 3 | Happy slow-motion trot, tongue flapping, no saliva | Zach's Kling clip, 1080p | `s-00` to `s-39` | tile |
| Pit stop | Slat mill comes apart and goes back together | Kling 4.0, from a studio still of her real mill | `x-00` to `x-47` | seamless |
| Finish line | Pup hops out, curls up on a dog bed, falls asleep | Kling 4.0 | `n-00` to `n-55` | tile |

Two sets, same names:
- `d/` desktop: 1280 x 720 WebP, about 6.3 MB total
- `m/` phone: about 3 MB total. Seamless shots keep the whole frame (640 x 360); tile shots are a 4:3-ish crop (640 x 472).

Nothing here loads until the page itself has finished loading. Then the scene loads one beat ahead of where the visitor is, a few frames at a time.

**Push-in note:** the push-in clip is cut at 3.75 s on purpose. After that point Kling drew ordinary motorized-looking treadmills inside the van, which is wrong for a "no motor" business. The scene hands off to the real interior photo instead.

## Swapping in a new clip

1. Generate or export the clip without a watermark, 1080p, 16:9.
2. Pull 8 frames per second:
   ```
   # desktop
   ffmpeg -i clip.mp4 -vf "fps=8,scale=1280:720" -start_number 0 -c:v libwebp -quality 56 d/s-%02d.webp
   # phone, tile shot (crop: 152 = how far from the left the crop starts, 0 to 304)
   ffmpeg -i clip.mp4 -vf "fps=8,scale=1280:720,crop=976:720:152:0,scale=640:472" -start_number 0 -c:v libwebp -quality 52 m/s-%02d.webp
   # phone, seamless shot (whole frame)
   ffmpeg -i clip.mp4 -vf "fps=8,scale=640:360" -start_number 0 -c:v libwebp -quality 54 m/v-%02d.webp
   ```
3. For a gold seamless shot, the gold in the clip will not be exactly brand gold. Shift background-hued pixels to `#F7B334` (any image tool with a hue/levels adjustment limited to the background, or the small script ZDub used in the build session). Without this you get a faint box around the footage.
4. In `js/scene.js`: update the frame count in `SHOTS`, and the line in `CHAPTERS` (where on the 0 to 1 scroll it plays, which beat text shows, `seamless: true` or a `field` color).

## Prompts that worked (Kling 4.0, image to video)

- **Van still on gold** (image edit of the real van still): "Cut this exact black van out of the street scene and place it in a seamless photo studio... entire background and floor one single flat solid golden yellow color... only a soft contact shadow under the van."
- **Arrival:** first frame = flat gold image, last frame = the van still on gold. "Locked-off static camera... van drives in from the left edge, travelling left to right, slows and comes to a gentle stop in the center... background stays the same flat golden yellow."
- **Door + push-in:** first frame = the van still on gold, no last frame. "Its large sliding side door glides smoothly open toward the rear... the camera pushes in toward the open doorway and through it."
- **Exploded mill:** first and last frame = a studio still of the mill. "The treadmill smoothly comes apart into a clean exploded view... parts float evenly spaced... then every part glides back and the machine reassembles."
- **Nap:** first frame = van with the door open, pup in the doorway, dog bed in the foreground. "The dog hops down, trots to the dog bed, turns one slow circle, flops down and falls asleep. Camera slowly pushes in."

## Rules
- Her real van and logo. Keep the subject in the center of the frame.
- Leave the top-left of the frame calm on desktop: the text card sits there.
- Never show a dog forced, strapped in to run, or alone and stressed. Never show motorized treadmills.
- AI footage that shows Emelyn or a client's dog needs her OK before the page goes live.
